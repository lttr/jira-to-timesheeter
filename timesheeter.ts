import { Cookie, ParamsWithInterval, Ticket } from "./types.ts";
import { Cache, createCache } from "./ui/cache.ts";

let cache: Cache<Ticket[]>;

export async function fillTimesheeter(
  inputData: Ticket[],
  {
    timesheeterEmail,
    timesheeterPassword,
    timesheeterProjectId,
    startDate,
    endDate,
  }: ParamsWithInterval,
  dryRun: boolean,
): Promise<void> {
  const sessionCookie = await logIntoTimesheeter(
    timesheeterEmail,
    timesheeterPassword,
  );
  const existingTickets: Ticket[] = await fetchTimesheets(
    timesheeterEmail,
    timesheeterPassword,
    startDate,
    endDate,
  );
  const toBeInserted = inputData.filter((inputTicket) => {
    return !existingTickets.find((existingTicket) => {
      const condition = existingTicket.ticket.endsWith(inputTicket.ticket) &&
        existingTicket.date.startsWith(inputTicket.date) &&
        inputTicket.hours === existingTicket.hours;
      if (condition) {
        console.warn(
          `An entry for ${inputTicket.date} ticket ${inputTicket.ticket} duration ${inputTicket.hours} hours is already in Timesheeter.`,
        );
      }
      return condition;
    });
  });

  for (const item of toBeInserted) {
    if (dryRun) {
      console.info(
        `DRY RUN: An entry would be inserted into timesheeter { date: ${item.date}, ticket: ${item.ticket}, hours: ${item.hours} }`,
      );
      continue;
    }
    await postItem(item, timesheeterProjectId, sessionCookie, timesheeterEmail);
  }
}

async function postItem(
  ticket: Ticket,
  timesheeterProjectId: string,
  cookie: Cookie,
  timesheeterEmail: string,
) {
  const payload = {
    homeOffice: true,
    desc: ticket.title,
    project: timesheeterProjectId,
    ticket: ticket.ticket,
    date: ticket.date,
    startTime: null,
    finishTime: null,
    time: ticket.hours,
  };
  const response = await fetch(
    "https://timesheeter-api.hanaboso.net/record/add",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie.name}=${cookie.value}`,
        Authorization: timesheeterEmail,
      },
    },
  );
  const result = response.status;
  if (result === 201) {
    console.info(
      `An entry for ${ticket.date} ticket ${ticket.ticket} duration ${ticket.hours} hours was inserted into Timesheeter.`,
    );
  }
}

type Token = string;

async function logIntoTimesheeter(
  timesheeterEmail: string,
  timesheeterPassword: string,
): Promise<Token> {
  const response = await fetch("https://timesheeter-api.hanaboso.net/login", {
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({
      email: timesheeterEmail,
      password: timesheeterPassword,
    }),
    method: "POST",
  });
  if (response.status !== 200) {
    throw new Error(
      `Login to Timesheeter was not successful. Status is: ${response.status}, and body is: ${response.body}`,
    );
  }
  console.debug("Login to Timesheeter was successful");

  const data = await response.json();
  const { token } = data;
  if (token) {
    return token;
  } else {
    console.error("Token was expected in response body");
    return "";
  }
}

interface TimesheeterTicket {
  ticket: string;
  desc: string;
  time: number;
  date: {
    date: string;
  };
}

/**
 * Example response
  const records = [
    {
      date: {
        date: "2021-10-14 00:00:00.000000",
        timezone_type: 3,
        timezone: "UTC",
      },
      deleted: false,
      desc: "Bla bla bla",
      externalId: null,
      fullTime: true,
      homeOffice: true,
      id: "24721",
      project: "Zásilkovna - weby",
      startTime: null,
      ticket: "ZAS-WEB-PACWEB-187",
      time: 0.5,
    },
  ];
 */
export async function fetchTimesheets(
  timesheeterEmail: string,
  timesheeterPassword: string,
  startDate: string,
  endDate: string,
): Promise<Ticket[]> {
  console.debug(`Fetching timesheeter data for user '${timesheeterEmail}'`);
  if (!cache) {
    console.debug("Cache does not exists, creating one");
    cache = createCache<Ticket[]>(
      () =>
        performTimesheeterFetch(
          timesheeterEmail,
          timesheeterPassword,
          startDate,
          endDate,
        ),
      1000 * 60,
    );
  }
  const key = [timesheeterEmail, startDate, endDate].join("|");
  const data = await cache.getData(key);
  return data ?? [];
}

async function performTimesheeterFetch(
  email: string,
  password: string,
  startDate: string,
  endDate: string,
): Promise<Ticket[]> {
  const token: Token = await logIntoTimesheeter(email, password);

  const response = await fetch(
    `https://timesheeter-api.hanaboso.net/record/list?filter={%22filter%22:[[{%22column%22:%22date%22,%22operator%22:%22BETWEEN%22,%22value%22:[%22${startDate}%22,%22${endDate}%22]}]],%22sorter%22:[{%22column%22:%22date%22,%22direction%22:%22DESC%22}],%22paging%22:{%22page%22:1,%22itemsPerPage%22:1000},%22search%22:null,%22params%22:null}`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    },
  );
  const data: { items: Array<TimesheeterTicket> } = await response.json();
  const mappedData = data.items.map((ticket) => ({
    ticket: ticket.ticket,
    title: ticket.desc,
    hours: ticket.time,
    date: ticket.date.date.slice(0, 10),
  }));
  return mappedData;
}
