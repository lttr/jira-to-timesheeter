import { html } from "../deps.ts";
import { beginningOfTheYear, today } from "./holidays.ts";
import { DataPage } from "./DataPage.ts";
import { InputParams, Ticket } from "../types.ts";
import { fetchTimesheets } from "../timesheeter.ts";

async function App(params: InputParams) {
  const timesheeterData = await timesheeter(params);
  return html`<div class="container-fluid">
    ${DataPage(timesheeterData, params)}
  </div>`;
}

async function timesheeter({
  timesheeterEmail,
  timesheeterPassword,
}: InputParams): Promise<Ticket[]> {
  const startDate = beginningOfTheYear.toString();
  const endDate = today.toString();
  return await fetchTimesheets(
    timesheeterEmail,
    timesheeterPassword,
    startDate,
    endDate
  );
}

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
        ${await App(params)}
      </body>
    </html>`;
  return output;
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
