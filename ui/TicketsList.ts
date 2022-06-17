import { html, Temporal } from "../deps.ts";
import { TicketsByDate } from "../types.ts";

export function TicketsList(
  ticketsByDate: TicketsByDate,
  currentDate: Temporal.PlainDate,
) {
  return html`<ul class="list-group">
    ${
    ticketsByDate[currentDate.toString()].map(
      (item) =>
        html`<li class="list-group-item fs-6 lh-sm p-1">
        <span title="${item.title}" class="d-inline-block" style="width: 11ch"
          >${item.ticket}</span
        >
        <span class="d-inline-block text-end" style="width: 4ch"
          >${item.hours}h</span
        >
      </li>`,
    )
  }
  </ul>`;
}
