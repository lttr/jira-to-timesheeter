import { config } from "https://deno.land/x/dotenv@v3.0.0/mod.ts";
const env = config();
const email = env.HANABOSO_EMAIL;
const password = env.HANABOSO_PASSWORD;

export async function fillTimesheeter(data) {
  const sessionCookie = await logIntoTimesheeter();

  // TODO kontrola existence - idempotence

  for (const item of data) {
    await postItem(item, sessionCookie);
  }
}

async function postItem(item, cookie) {
  const payload = {
    homeOffice: true,
    desc: item.title,
    // TODO Konfigurovatelny projekt
    project: "42",
    ticket: item.issue,
    date: item.date,
    startTime: null,
    finishTime: null,
    time: item.hours,
  };
  const response = await fetch(
    "https://timesheeter-api.hanaboso.net/record/add",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Cookie: `${cookie.name}=${cookie.value}`,
        Authorization: email,
      },
    }
  );
  const result = await response.status;
  console.log(`Item from ${item.date} for ticket ${item.issue}: ${result}`);
}

async function logIntoTimesheeter() {
  const response = await fetch("https://timesheeter-api.hanaboso.net/login", {
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
  const cookies = response.headers.get("set-cookie");
  const cookieNameAndValue = cookies.split(";")[0].split("=");
  return {
    name: cookieNameAndValue[0],
    value: cookieNameAndValue[1],
  };
}

fetch(
  "https://timesheeter-api.hanaboso.net/record/list?filter={%22filter%22:[[{%22column%22:%22date%22,%22operator%22:%22BETWEEN%22,%22value%22:[%222021-10-01%22,%222021-10-31%22]}]],%22sorter%22:[{%22column%22:%22date%22,%22direction%22:%22DESC%22}],%22paging%22:{%22page%22:1,%22itemsPerPage%22:10},%22search%22:null,%22params%22:null}",
  {
    headers: {
      accept: "application/json",
      "accept-language": "cs-CZ,cs;q=0.9",
      authorization: "trumm.l@hanaboso.com",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    referrer: "https://timesheeter.hanaboso.net/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  }
);
