import { tenDaysAgo, today } from "./utils.js";

import { getClockworkData } from "./jira.js";
import { fillTimesheeter } from "./timesheeter.js";

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
