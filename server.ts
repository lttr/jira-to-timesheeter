import { http } from "./deps.ts";
import { renderApp } from "./ui/App.ts";
import { main } from "./main.ts";
import { getParams } from "./utils.ts";
import { InputParams } from "./types.ts";

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
    if (!request.headers.has("Authorization")) {
      return new Response(null, {
        status: 401,
        headers: {
          "WWW-Authenticate": "Basic",
        },
      });
    } else {
      const auth = request.headers.get("Authorization")?.split(" ")[1] ?? "";
      const [login, password] = atob(auth).split(":");

      const params = await getParams("./params.json");
      const mergedParams: InputParams = {
        ...params,
        timesheeterEmail: login,
        timesheeterPassword: password,
      };
      let html = "";
      try {
        html = await renderApp(mergedParams);
      } catch (error) {
        console.error(error);
        return new Response(
          `Your credentials does not work for Timesheeter (login: ${login})`,
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

console.log("Listening on http://localhost:8080");
await http.listenAndServe(":8080", handleRequest);
