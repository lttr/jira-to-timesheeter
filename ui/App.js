import { html } from "html";
import { tenDaysAgo, today } from "../utils.js";
import { getClockworkData } from "../jira.js";
import { DataTable } from "./DataTable.js";

function App(data) {
  return html`<div class="container">${DataTable(data)}</div>`;
}
async function jira(params) {
  const data = await getClockworkData({
    startDate: tenDaysAgo,
    endDate: today,
    ...params,
  });
  return data;
}

const dummyData = {
  data: [
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 3.5,
      date: "2022-01-24",
    },
    {
      ticket: "PACWEB-573",
      title: "Write down the exact procedure for the future",
      hours: 0.5,
      date: "2022-01-24",
    },
    {
      ticket: "PACWEB-556",
      title: "Create new Playground website",
      hours: 0.5,
      date: "2022-01-24",
    },
    {
      ticket: "PACWEB-559",
      title:
        "Connect blog components and blog articles to Storyblok and publishing process",
      hours: 5,
      date: "2022-01-25",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 2,
      date: "2022-01-25",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 3,
      date: "2022-01-26",
    },
    {
      ticket: "PACWEB-557",
      title:
        "Create structure in Storyblok that would enable to publish articles on Playground website",
      hours: 2,
      date: "2022-01-26",
    },
    {
      ticket: "PACWEB-558",
      title:
        "Implement a couple of blog specific components in codebase and in SB",
      hours: 2,
      date: "2022-01-26",
    },
    {
      ticket: "PACWEB-558",
      title:
        "Implement a couple of blog specific components in codebase and in SB",
      hours: 4.5,
      date: "2022-01-27",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 2,
      date: "2022-01-27",
    },
    {
      ticket: "PACWEB-558",
      title:
        "Implement a couple of blog specific components in codebase and in SB",
      hours: 4,
      date: "2022-01-28",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 2.5,
      date: "2022-01-28",
    },
    {
      ticket: "PACWEB-633",
      title:
        "Check whether it will be needed to update the build pipeline triggering logic",
      hours: 0.5,
      date: "2022-01-28",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 3.5,
      date: "2022-01-31",
    },
    {
      ticket: "PACWEB-542",
      title: "Create new blog prototype",
      hours: 3,
      date: "2022-01-31",
    },
    {
      ticket: "PACWEB-516",
      title: "Remove gitbot from CI",
      hours: 0.5,
      date: "2022-01-31",
    },
    {
      ticket: "PACWEB-3",
      title: "Standups, meetings, plannigns, project card ...",
      hours: 3,
      date: "2022-02-01",
    },
    {
      ticket: "PACWEB-542",
      title: "Create new blog prototype",
      hours: 2,
      date: "2022-02-01",
    },
    {
      ticket: "PACWEB-571",
      title: "Missing Blog Article After Update (SK)",
      hours: 2,
      date: "2022-02-01",
    },
    {
      ticket: "PACWEB-349",
      title: "Remove unnecessary fetching of blog news",
      hours: 0.5,
      date: "2022-02-01",
    },
    {
      ticket: "PACWEB-349",
      title: "Remove unnecessary fetching of blog news",
      hours: 0.5,
      date: "2022-02-02",
    },
    {
      ticket: "PACWEB-516",
      title: "Remove gitbot from CI",
      hours: 1,
      date: "2022-02-02",
    },
    {
      ticket: "PACWEB-633",
      title:
        "Check whether it will be needed to update the build pipeline triggering logic",
      hours: 0.5,
      date: "2022-02-02",
    },
  ],
};

export async function renderApp(params) {
  // const jiraData = await jira(params);
  const jiraData = dummyData.data;
  const output = html`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://cdn.skypack.dev/bootstrap@5/dist/css/bootstrap.min.css"
          rel="stylesheet"
          crossorigin="anonymous"
        />
      </head>
      <body>
        ${App(jiraData)}
      </body>
    </html>`;
  return output;
}
