import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
const env = config();
import { getClockworkData } from "./jira.js";
import { fillTimesheeter } from "./timesheeter.js";

const data = await getClockworkData({
  clockworkToken: env.CLOCKWORK_TOKEN,
  startDate: "2021-10-02",
  endDate: "2021-10-15",
  projectKey: "PACWEB",
  userEmail: env.HANABOSO_EMAIL,
});

await fillTimesheeter(data);
