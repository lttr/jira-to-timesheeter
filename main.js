import { Temporal } from "https://cdn.skypack.dev/@js-temporal/polyfill";

import { getClockworkData } from "./jira.js";
import { fillTimesheeter } from "./timesheeter.js";

export async function main(params, dryRun = false) {
  const weekAgo = Temporal.Now.plainDateISO().subtract({ weeks: 1 }).toString();
  const today = Temporal.Now.plainDateISO().toString();
  const paramsWithDates = {
    startDate: weekAgo,
    endDate: today,
    ...params,
  };

  logParameters(paramsWithDates);

  const data = await getClockworkData(paramsWithDates);
  await fillTimesheeter(data, paramsWithDates, dryRun);
  return "OK";
}

function logParameters({
  email,
  jiraProjectKey,
  timesheeterProjectId,
  startDate,
  endDate,
}) {
  console.info(
    `Params are { email: ${email}, jiraProjectKey: ${jiraProjectKey}, timesheeterProjectId: ${timesheeterProjectId} }`
  );
  console.info(`Processing dates between ${startDate} and ${endDate}`);
}
