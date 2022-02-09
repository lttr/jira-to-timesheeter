import { http } from "./deps.js";
import { renderApp } from "./ui/App.js";
import { main } from "./main.js";
import { getParams } from "./utils.js";

async function handleRequest(request) {
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
