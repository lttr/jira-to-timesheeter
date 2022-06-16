import { html, Temporal } from "../deps.ts";
import { TicketsByDate, Ticket } from "../types.ts";
import {
  DateRange,
  formatCzechDate,
  formatCzechWeekDay,
  isHoliday,
  isWorkDay,
} from "./holidays.ts";
import { TicketsList } from "./TicketsList.ts";

const TARGET = 7;

export function DataTable(
  ticketsByDate: TicketsByDate,
  rangeOfPlainDates: DateRange
) {
  const holidayClass = "bg-secondary bg-opacity-10";
  return html`
    <div class="table-responsive" id="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>datum</th>
            <th>záznamy</th>
            <th>hodiny</th>
          </tr>
        </thead>
        <tbody>
            ${rangeOfPlainDates.map(
              (currentDate) =>
                html`
                  <tr>
                    <th class=${isHoliday(currentDate) && holidayClass}>
                      <div>${formatCzechWeekDay(currentDate)}</div>
                      <div>${formatCzechDate(currentDate)}</div>
                    </th>

                    <td class=${isHoliday(currentDate) && holidayClass}>
                      ${TicketsList(ticketsByDate, currentDate)}
                    </td>
                    <td class=${isHoliday(currentDate) && holidayClass}>
                      ${TotalHoursForDate(ticketsByDate, currentDate)}
                    </td>
                  </tr>
                `
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
  ticketsByDate: TicketsByDate,
  currentDate: Temporal.PlainDate
) {
  const total = ticketsByDate[currentDate.toString()].reduce(
    (acc: number, curr: Ticket) => curr.hours + acc,
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
