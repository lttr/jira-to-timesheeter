import { html, Temporal } from "../deps.ts";
import { Ticket, TicketsByDate } from "../types.ts";
import { listOfMonths, workingDaysInEveryMonth } from "./holidays.ts";

interface MonthRecord {
  name: string;
  hoursWorked: number;
  hours8: number;
  hours7: number;
  soFarHoursWorked: number;
  soFarHours8: number;
  soFarHours7: number;
}

function mapOfMonths(): Map<number, MonthRecord> {
  const map: Map<number, MonthRecord> = new Map();
  listOfMonths().forEach((month, index) => {
    map.set(index + 1, {
      name: month,
      hoursWorked: 0,
      hours8: 0,
      hours7: 0,
      soFarHoursWorked: 0,
      soFarHours8: 0,
      soFarHours7: 0,
    });
  });
  return map;
}

function sumTickets(tickets: Ticket[]) {
  return tickets.reduce((acc, curr) => acc + curr.hours, 0);
}

function ticketsByMonth(ticketsByDate: TicketsByDate) {
  const months = mapOfMonths();
  // calculate actual worked hours
  for (const [day, tickets] of Object.entries(ticketsByDate)) {
    const plainDate = Temporal.PlainDate.from(day);
    const month = months.get(plainDate.month);
    if (month) {
      month.hoursWorked += sumTickets(tickets);
    }
  }
  // calculate teoretical working hours
  for (const [monthIndex, workingDays] of workingDaysInEveryMonth().entries()) {
    const month = months.get(monthIndex);
    if (month) {
      month.hours8 += workingDays * 8;
      month.hours7 += workingDays * 7;
    }
  }
  // calculate so far hours
  let lastMonth = null;
  for (const month of months.values()) {
    if (lastMonth) {
      month.soFarHoursWorked = lastMonth.soFarHoursWorked + month.hoursWorked;
      month.soFarHours7 = lastMonth.soFarHours7 + month.hours7;
      month.soFarHours8 = lastMonth.soFarHours8 + month.hours8;
    } else {
      month.soFarHoursWorked = month.hoursWorked;
      month.soFarHours7 = month.hours7;
      month.soFarHours8 = month.hours8;
    }
    lastMonth = month;
  }
  return months;
}

export function Stats(ticketsByDate: TicketsByDate) {
  const months: MonthRecord[] = [...ticketsByMonth(ticketsByDate).values()];
  const total = months.reduce(
    (acc, curr) => ({
      hoursWorked: acc.hoursWorked + curr.hoursWorked,
      hours8: acc.hours8 + curr.hours8,
      hours7: acc.hours7 + curr.hours7,
    }),
    { hoursWorked: 0, hours8: 0, hours7: 0 },
  );
  return html`
    <table class="table table-hover">
      <thead>
        <tr>
          <th>měsíc</th>
          <th>odpracováno</th>
          <th>dosud (oproti 7h době)</th>
          <th>kalendářová 7h doba</th>
          <th>kalendářová 8h doba</th>
        </tr>
      </thead>
      <tbody>
        ${
    months.map(
      (month, index) =>
        html` <tr
              class="${
          new Date().getMonth() > index ? "bg-warning bg-opacity-10" : ""
        }"
            >
              <th scope="row">${month.name}</th>
              <td>
                <span>${month.hoursWorked}h</span>
                <span class="text-secondary"
                  >${(month.hoursWorked / 7).toFixed(1)}d</span
                >
                <span class="text-secondary"
                  >(${month.hoursWorked - month.hours7 > 0 ? "+" : ""}${
          month.hoursWorked - month.hours7
        }h
                  ${((month.hoursWorked - month.hours7) / 7).toFixed(1)}d)</span
                >
              </td>
              <td>
                <span class="text-secondary"
                  >(${
          month.soFarHoursWorked - month.soFarHours7 > 0 ? "+" : ""
        }${month.soFarHoursWorked - month.soFarHours7}h
                  ${
          ((month.soFarHoursWorked - month.soFarHours7) / 7).toFixed(
            1,
          )
        }d)</span
                >
              </td>
              <td>
                ${month.hours7}
                <span class="text-secondary">(${month.hours7 / 7}d)</span>
              </td>
              <td>
                ${month.hours8}
                <span class="text-secondary">(${month.hours8 / 8}d)</span>
              </td>
            </tr>`,
    )
  }
        <tr class="bg-success bg-opacity-10">
          <th scope="row">celkem</th>
          <td>
            <span>${total.hoursWorked}</span>
            <span class="text-secondary"
              >${(total.hoursWorked / 7).toFixed(1)}d</span
            >
          </td>
          <td>
            <span class="text-secondary"
              >(${total.hoursWorked - total.hours7 > 0 ? "+" : ""}${
    total.hoursWorked - total.hours7
  }h
              ${((total.hoursWorked - total.hours7) / 7).toFixed(1)}d)</span
            >
          </td>
          <td>
            <span>${total.hours7}</span>
            <span class="text-secondary">(${total.hours7 / 7}d)</span>
          </td>
          <td>
            <span>${total.hours8}</span>
            <span class="text-secondary">(${total.hours7 / 8}d)</span>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}
