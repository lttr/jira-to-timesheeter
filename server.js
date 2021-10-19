import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";
import { main } from "./main.js";

async function handleRequest(request) {
  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      statusText: "Method Not Allowed",
    });
  }

  const params = await request.json();
  const result = await main(params);

  const responseInit = {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  };
  return new Response(result, responseInit);
}

console.log("Listening on http://localhost:8080");
await listenAndServe(":8080", handleRequest);
