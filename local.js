import { main } from "./main.js";

async function getParams(filePath) {
  return JSON.parse(await Deno.readTextFile(filePath));
}

const params = await getParams("./params.json");

const dryRun = Deno.args.includes("--dry-run");

main(params, dryRun);
