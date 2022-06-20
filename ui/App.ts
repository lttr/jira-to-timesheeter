import { html } from "../deps.ts";
import { beginningOfTheYear, today } from "./holidays.ts";
import { DataPage } from "./DataPage.ts";
import { Ticket, TimesheeterParams } from "../types.ts";
import { fetchTimesheets } from "../timesheeter.ts";

async function App(params: TimesheeterParams) {
  const timesheeterData = await timesheeter(params);
  return html`<div class="container-fluid">
    ${DataPage(timesheeterData, params)}
  </div>`;
}

async function timesheeter({
  timesheeterEmail,
  timesheeterPassword,
}: TimesheeterParams): Promise<Ticket[]> {
  const startDate = beginningOfTheYear.toString();
  const endDate = today.toString();
  return await fetchTimesheets(
    timesheeterEmail,
    timesheeterPassword,
    startDate,
    endDate
  );
}

export async function renderApp(params: TimesheeterParams) {
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
