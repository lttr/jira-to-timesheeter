import { http } from "./deps.ts";
import { renderApp } from "./ui/App.ts";
import { main } from "./main.ts";
import { getParams } from "./utils.ts";
import { TimesheeterParams } from "./types.ts";

async function handleRequest(request: Request) {
  if (request.method === "POST") {
    const params = await request.json();
    const result = await main(params);

    return new Response(result, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  if (request.method === "GET") {
    let params: TimesheeterParams = {
      timesheeterEmail: "",
      timesheeterPassword: "",
    };
    try {
      params = await getParams("./params.json");
    } catch (_) {
      // No params in a file, needs to be authorized
      console.debug(
        "File 'params.json' is not present, authorization will be used"
      );
    }

    if (params.timesheeterEmail && params.timesheeterPassword) {
      console.debug("Local dev");
      const html = await renderApp(params);
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
      });
    }

    if (!request.headers.has("Authorization")) {
      console.debug("Prod not authorized");
      return new Response(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic",
        },
      });
    } else {
      console.debug("Prod has authorization header");
      const auth = request.headers.get("Authorization")?.split(" ")[1] ?? "";
      const [timesheeterEmail, timesheeterPassword] = atob(auth).split(":");

      if (!timesheeterEmail || !timesheeterPassword) {
        return new Response(`Please enter login and password`, {
          status: 404,
          headers: {
            "WWW-Authenticate": "Basic",
          },
        });
      }

      let html = "";
      try {
        html = await renderApp({ timesheeterEmail, timesheeterPassword });
      } catch (error) {
        console.error(error);
        return new Response(
          `Your credentials does not work for Timesheeter (login: ${timesheeterEmail})`,
          {
            status: 401,
            headers: {
              "WWW-Authenticate": "Basic",
            },
          }
        );
      }
      console.debug("HTML is ready to be served");
      return new Response(html, {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "WWW-Authenticate": "Basic",
        },
      });
    }
  }

  return new Response(null, {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

try {
  await http.serve(handleRequest, { port: 3200 });
} catch (e) {
  console.error(e);
}
