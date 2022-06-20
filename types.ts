export interface TimesheeterParams {
  timesheeterEmail: string;
  timesheeterPassword: string;
}

export type InputParams = TimesheeterParams & {
  clockworkToken: string;
  jiraProjectKey: string;
  timesheeterProjectId: string;
};

export interface Interval {
  endDate: string;
  startDate: string;
}

export type ParamsWithInterval = InputParams & Interval;

export interface Ticket {
  ticket: string;
  title: string;
  hours: number;
  date: string;
}

export type TicketsByDate = {
  [key: string]: Ticket[];
};

export interface Cookie {
  name: string;
  value: string;
}
