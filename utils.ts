import { Temporal } from "./deps.ts";

export const tenDaysAgo = Temporal.Now.plainDateISO()
  .subtract({ days: 10 })
  .toString();
export const today = Temporal.Now.plainDateISO().toString();

export async function getParams(filePath: string) {
  return JSON.parse(await Deno.readTextFile(filePath));
}
