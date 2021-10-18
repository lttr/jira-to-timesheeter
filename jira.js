export async function getClockworkData({
  clockworkToken,
  startDate,
  endDate,
  projectKey,
  userEmail,
}) {
  console.log(`getClockworkData function called with parameters:`, {
    clockworkToken,
    startDate,
    endDate,
    projectKey,
    userEmail,
  });
  // Clockwork docs https://herocoders.atlassian.net/wiki/spaces/CLK/pages/2999975967/Use+the+Clockwork+API
  const url = new URL("https://api.clockwork.report/v1/worklogs");
  const params = {
    starting_at: startDate,
    ending_at: endDate,
    "project_keys[]": projectKey,
    "user_query[]": userEmail,
    expand: "issues",
  };
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    headers: {
      Authorization: `Token ${clockworkToken}`,
    },
  });
  const data = await response.json();

  return data.map(({ timeSpentSeconds, issue, started }) => {
    return {
      issue: issue.key,
      title: issue.fields.summary,
      hours: timeSpentSeconds / 3600,
      date: started.substr(0, 10),
    };
  });
}
