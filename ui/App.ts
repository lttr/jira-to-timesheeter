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
