import { html } from "../deps.ts";
import { tenDaysAgo, today } from "../utils.ts";
import { getClockworkData } from "../jira.ts";
import { DataTable } from "./DataTable.ts";
import { InputParams, Ticket } from "../types.ts";
import { logIntoTimesheeter, listRecords } from "../timesheeter.ts";

async function App(params: InputParams) {
  const jiraData = await jira(params);
  // const jiraData = dummyData;
  const timesheeterData = await timesheeter(params);
  // const timesheeterData = dummyData;
  return html`<div class="container-fluid">
    ${DataTable(jiraData, timesheeterData)}
  </div>`;
}

async function jira(params: InputParams) {
  const data = await getClockworkData({
    startDate: tenDaysAgo,
    endDate: today,
    ...params,
  });
  return data;
}

async function timesheeter({
  timesheeterEmail,
  timesheeterPassword,
}: InputParams): Promise<Ticket[]> {
  const startDate = tenDaysAgo;
  const endDate = today;
  const sessionCookie = await logIntoTimesheeter(
    timesheeterEmail,
    timesheeterPassword
  );
  const existingTickets: Ticket[] = await listRecords(
    sessionCookie,
    timesheeterEmail,
    startDate,
    endDate
  );
  return existingTickets.map((ticket) => ({
    ...ticket,
    ticket: ticket.ticket.replace("ZAS-WEB-", ""),
  }));
}

const dummyData = [
  {
    ticket: "PACWEB-3",
    title: "Standups, meetings, plannigns, project card ...",
    hours: 3.5,
    date: "2022-02-06",
  },
  {
    ticket: "PACWEB-573",
    title: "Write down the exact procedure for the future",
    hours: 0.5,
    date: "2022-02-07",
  },
  {
    ticket: "PACWEB-556",
    title: "Create new Playground website",
    hours: 0.5,
    date: "2022-02-08",
  },
  {
    ticket: "PACWEB-559",
    title:
      "Connect blog components and blog articles to Storyblok and publishing process",
    hours: 5,
    date: "2022-02-09",
  },
  {
    ticket: "PACWEB-3",
    title: "Standups, meetings, plannigns, project card ...",
    hours: 2,
    date: "2022-02-10",
  },
  {
    ticket: "PACWEB-3",
    title: "Standups, meetings, plannigns, project card ...",
    hours: 3,
    date: "2022-02-11",
  },
  {
    ticket: "PACWEB-557",
    title:
      "Create structure in Storyblok that would enable to publish articles on Playground website",
    hours: 2,
    date: "2022-02-12",
  },
  {
    ticket: "PACWEB-558",
    title:
      "Implement a couple of blog specific components in codebase and in SB",
    hours: 2,
    date: "2022-02-13",
  },
  {
    ticket: "PACWEB-558",
    title:
      "Implement a couple of blog specific components in codebase and in SB",
    hours: 4.5,
    date: "2022-02-14",
  },
  {
    ticket: "PACWEB-3",
    title: "Standups, meetings, plannigns, project card ...",
    hours: 2,
    date: "2022-02-14",
  },
];

export async function renderApp(params: InputParams) {
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
        ${App(params)}
      </body>
    </html>`;
  return output;
}
