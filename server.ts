import { http } from "./deps.ts";
import { renderApp } from "./ui/App.ts";
import { main } from "./main.ts";
import { getParams } from "./utils.ts";

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
    const params = await getParams("./params.json");
    const html = await renderApp(params);
    console.debug("HTML is ready to be served");
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return new Response(null, {
    status: 405,
    statusText: "Method Not Allowed",
  });
}

console.log("Listening on http://localhost:8080");
await http.listenAndServe(":8080", handleRequest);
