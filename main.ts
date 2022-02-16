import { tenDaysAgo, today } from "./utils.ts";

import { getClockworkData } from "./jira.ts";
import { fillTimesheeter } from "./timesheeter.ts";

export async function main(params, dryRun = false) {
  const paramsWithDates = {
    startDate: tenDaysAgo,
    endDate: today,
    ...params,
  };

  logParameters(paramsWithDates);

  const data = await getClockworkData(paramsWithDates);
  await fillTimesheeter(data, paramsWithDates, dryRun);
  return "OK";
}

function logParameters({
  timesheeterEmail,
  jiraProjectKey,
  timesheeterProjectId,
  startDate,
  endDate,
}) {
  console.info(
    `Params are { timesheeterEmail: ${timesheeterEmail}, jiraProjectKey: ${jiraProjectKey}, timesheeterProjectId: ${timesheeterProjectId} }`
  );
  console.info(`Processing dates between ${startDate} and ${endDate}`);
}
