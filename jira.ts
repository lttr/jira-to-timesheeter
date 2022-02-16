export async function getClockworkData({
  clockworkToken,
  startDate,
  endDate,
  jiraProjectKey,
  timesheeterEmail,
}) {
  // Clockwork docs https://herocoders.atlassian.net/wiki/spaces/CLK/pages/2999975967/Use+the+Clockwork+API
  const url = new URL("https://api.clockwork.report/v1/worklogs");
  const params = {
    starting_at: startDate,
    ending_at: endDate,
    "project_keys[]": jiraProjectKey,
    "user_query[]": timesheeterEmail,
    expand: "issues",
  };
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clockworkToken}`,
    },
  });
  const data = await response.json();
  if (Array.isArray(data)) {
    console.info(
      `Clockwork data has been successfully downloaded, found ${data.length} entries.`
    );
  }
  return data.map(({ timeSpentSeconds, issue, started }) => {
    return {
      ticket: issue.key,
      title: issue.fields.summary,
      hours: timeSpentSeconds / 3600,
      date: started.substr(0, 10),
    };
  });
}
