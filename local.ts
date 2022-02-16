import { main } from "./main.js";
import { getParams } from "./utils.js";

const params = await getParams("./params.json");

const dryRun = Deno.args.includes("--dry-run");

main(params, dryRun);
