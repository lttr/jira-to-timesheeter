import { html, Temporal } from "../deps.ts";
import { DataTable } from "./DataTable.ts";
import { InputParams, Ticket, TicketsByDate } from "../types.ts";
import { beginningOfTheYear, dateRange, today } from "./holidays.ts";
import { Stats } from "./Stats.ts";

function mapDatesToTickets(data: Ticket[], range: Temporal.PlainDate[]) {
  const result: TicketsByDate = {};
  for (const date of range) {
    result[date.toString()] = [];
  }
  for (const item of data) {
    result[item.date]?.push(item);
  }
  for (const date of range) {
    result[date.toString()].sort((a, b) =>
      new Intl.Collator([], { numeric: true }).compare(a.ticket, b.ticket)
    );
  }
  return result;
}

export function DataPage(timesheeterData: Ticket[], params: InputParams) {
  const rangeOfPlainDates = dateRange(beginningOfTheYear, today);
  const ticketsByDate = mapDatesToTickets(timesheeterData, rangeOfPlainDates);

  return html`<div>
    <header class="p-4">
      <h2>
        Pracovní výkazy ${Temporal.Now.plainDateISO().year} pro
        ${params.timesheeterEmail}
      </h2>
    </header>
    <section class="p-4">${Stats(ticketsByDate)}</section>
    <section class="p-4">
      ${DataTable(ticketsByDate, rangeOfPlainDates)}
    </section>
  </div> `;
}
