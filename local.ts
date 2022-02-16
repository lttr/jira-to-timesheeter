import { main } from "./main.ts";
import { getParams } from "./utils.ts";

const params = await getParams("./params.json");

const dryRun = Deno.args.includes("--dry-run");

main(params, dryRun);
