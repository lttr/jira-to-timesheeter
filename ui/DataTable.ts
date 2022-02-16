import { html, Temporal } from "../deps.ts";
import { DatesToTicketsMap, Ticket } from "../types.ts";
import {
  dateRange,
  today,
  tenDaysAgo,
  formatCzechDate,
  formatCzechWeekDay,
  isHoliday,
  isWorkDay,
} from "./holidays.ts";
import { TicketsList } from "./TicketsList.ts";

function mapDatesToTickets(data: Ticket[], range: Temporal.PlainDate[]) {
  const result: DatesToTicketsMap = {};
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

const TARGET = 7;

export function DataTable(jiraData: Ticket[], timesheeterData: Ticket[]) {
  const rangeOfPlainDates = dateRange(tenDaysAgo, today);
  const jiraTicketsByDate = mapDatesToTickets(jiraData, rangeOfPlainDates);
  const timesheeterTicketsByDate = mapDatesToTickets(
    timesheeterData,
    rangeOfPlainDates
  );
  const holidayClass = "bg-secondary bg-opacity-10";
  return html`
    <div class="table-responsive" id="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            ${rangeOfPlainDates.map(
              (currentDate) =>
                html`<th
                  scope="col"
                  class=${isHoliday(currentDate) && holidayClass}
                >
                  <div>${formatCzechWeekDay(currentDate)}</div>
                  <div>${formatCzechDate(currentDate)}</div>
                </th>`
            )}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Jira</th>
            ${rangeOfPlainDates.map(
              (currentDate) =>
                html`<td class=${isHoliday(currentDate) && holidayClass}>
                  ${TicketsList(jiraTicketsByDate, currentDate)}
                </td>`
            )}
          </tr>
          <tr>
            <th scope="row">Jira total</th>
            ${rangeOfPlainDates.map(
              (currentDate) => html`<td
                class=${isHoliday(currentDate) && holidayClass}
              >
                ${TotalHoursForDate(jiraTicketsByDate, currentDate)}
              </td>`
            )}
          </tr>
          <tr>
            <th scope="row">Timesheeter</th>
            ${rangeOfPlainDates.map(
              (currentDate) =>
                html`<td class=${isHoliday(currentDate) && holidayClass}>
                  ${TicketsList(timesheeterTicketsByDate, currentDate)}
                </td>`
            )}
          </tr>
          <tr>
            <th scope="row">Timesheeter total</th>
            ${rangeOfPlainDates.map(
              (currentDate) => html`<td
                class=${isHoliday(currentDate) && holidayClass}
              >
                ${TotalHoursForDate(timesheeterTicketsByDate, currentDate)}
              </td>`
            )}
          </tr>
        </tbody>
      </table>
    </div>

    <script>
      const tableWrapper = document.querySelector("#table-wrapper");
      const table = tableWrapper.querySelector("table");
      tableWrapper.scrollTo({ left: table.offsetWidth });
    </script>

    <style>
      .table-responsive thead th {
        position: sticky;
        top: 0;
        z-index: 1;
        background: white;
      }
      .table-responsive thead th:first-child {
        position: sticky;
        left: 0;
        z-index: 2;
        background: white;
      }
      .table-responsive tbody th {
        position: sticky;
        left: 0;
        z-index: 1;
        background: white;
      }
    </style>
  `;
}

function TotalHoursForDate(
  ticketsByDate: DatesToTicketsMap,
  currentDate: Temporal.PlainDate
) {
  const total = ticketsByDate[currentDate.toString()].reduce(
    (acc, curr) => curr.hours + acc,
    0
  );
  return html`<span
    class=${`d-inline-block text-end p-1
      ${total > TARGET && isWorkDay(currentDate) && "bg-danger bg-opacity-25"}
      ${total < TARGET && isWorkDay(currentDate) && "bg-warning bg-opacity-25"}
    `}
    style="width: 17ch"
    >${total}h
  </span>`;
}
