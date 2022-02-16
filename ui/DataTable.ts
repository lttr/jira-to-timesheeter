import { html } from "../deps.ts";
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

function mapDatesToTickets(data, range) {
  const result = {};
  for (const date of range) {
    result[date.toString()] = [];
  }
  for (const item of data) {
    result[item.date]?.push(item);
  }
  return result;
}

const TARGET = 7;

export function DataTable(jiraData) {
  const rangeOfPlainDates = dateRange(tenDaysAgo, today);
  const ticketsByDate = mapDatesToTickets(jiraData, rangeOfPlainDates);
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
                  ${TicketsList(ticketsByDate, currentDate)}
                </td>`
            )}
          </tr>
          <tr>
            <th scope="row">Jira total</th>
            ${rangeOfPlainDates.map(
              (currentDate) => html`<td
                class=${isHoliday(currentDate) && holidayClass}
              >
                ${TotalHoursForDate(ticketsByDate, currentDate)}
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

function TotalHoursForDate(ticketsByDate, currentDate) {
  const total = ticketsByDate[currentDate.toString()].reduce(
    (acc, curr) => curr.hours + acc,
    0
  );
  return html`<span
    class=${`d-inline-block text-end p-1
      ${total >= TARGET && isWorkDay(currentDate) && "bg-danger bg-opacity-25"}
      ${total <= TARGET && isWorkDay(currentDate) && "bg-warning bg-opacity-25"}
    `}
    style="width: 17ch"
    >${total}h
  </span>`;
}
