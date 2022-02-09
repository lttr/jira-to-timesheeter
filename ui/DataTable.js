import { html } from "html";
import {
  dateRange,
  today,
  tenDaysAgo,
  formatCzechDate,
  formatCzechWeekDay,
  isHoliday,
  isWorkDay,
} from "./holidays.js";

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
  const jiraTicketsByDate = mapDatesToTickets(jiraData, rangeOfPlainDates);
  const holidayClass = "bg-secondary bg-opacity-10";
  return html`
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
    <div class="table-responsive">
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
                  ${ListOfTickets(jiraTicketsByDate, currentDate)}
                </td>`
            )}
          </tr>
          <tr>
            <th scope="row">Jira total</th>
            ${rangeOfPlainDates.map(
              (currentDate) => html`<td
                class=${isHoliday(currentDate) && holidayClass}
              >
                ${TotalJiraHoursForDate(jiraTicketsByDate, currentDate)}
              </td>`
            )}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function TotalJiraHoursForDate(jiraTicketsByDate, currentDate) {
  const total = jiraTicketsByDate[currentDate.toString()].reduce(
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

function ListOfTickets(jiraTicketsByDate, currentDate) {
  return html`<ul class="list-group">
    ${jiraTicketsByDate[currentDate.toString()].map(
      (item) => html`<li class="list-group-item fs-6 lh-sm p-1">
        <span title="${item.title}" class="d-inline-block" style="width: 11ch"
          >${item.ticket}</span
        >
        <span class="d-inline-block text-end" style="width: 4ch"
          >${item.hours}h</span
        >
      </li>`
    )}
  </ul>`;
}
