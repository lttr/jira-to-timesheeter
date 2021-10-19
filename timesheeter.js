export async function fillTimesheeter(
  data,
  { email, password, projectId, startDate, endDate },
  dryRun
) {
  const sessionCookie = await logIntoTimesheeter(email, password);
  const records = await listRecords(sessionCookie, email, startDate, endDate);
  const toBeInserted = data.filter((item) => {
    return !records.items.find((record) => {
      const condition =
        record.ticket.endsWith(item.ticket) &&
        record.date.date.startsWith(item.date) &&
        item.hours === record.time;
      if (condition) {
        console.warn(
          `An entry for ${item.date} ticket ${item.ticket} duration ${item.hours} hours is already in Timesheeter.`
        );
      }
      return condition;
    });
  });

  for (const item of toBeInserted) {
    if (dryRun) {
      console.log(
        `DRY RUN: An entry would be inserted into timesheeter { date: ${item.date}, ticket: ${item.ticket}, hours: ${item.hours} }`
      );
      continue;
    }
    await postItem(item, projectId, sessionCookie, email);
  }
}

async function postItem(item, projectId, cookie, email) {
  const payload = {
    homeOffice: true,
    desc: item.title,
    project: projectId,
    ticket: item.ticket,
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
  const result = response.status;
  if (result === 201) {
    console.info(
      `An entry for ${item.date} ticket ${item.ticket} duration ${item.hours} hours was inserted into Timesheeter.`
    );
  }
}

async function logIntoTimesheeter(email, password) {
  const response = await fetch("https://timesheeter-api.hanaboso.net/login", {
    headers: {
      accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
    method: "POST",
  });
  if (response.status !== 200) {
    throw new Error("Login to Timesheeter was not successful.");
  }
  console.log("Login to Timesheeter was successful.");
  const cookies = response.headers.get("set-cookie");
  const cookieNameAndValue = cookies.split(";")[0].split("=");
  return {
    name: cookieNameAndValue[0],
    value: cookieNameAndValue[1],
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
async function listRecords(cookie, email, startDate, endDate) {
  const response = await fetch(
    `https://timesheeter-api.hanaboso.net/record/list?filter={%22filter%22:[[{%22column%22:%22date%22,%22operator%22:%22BETWEEN%22,%22value%22:[%22${startDate}%22,%22${endDate}%22]}]],%22sorter%22:[{%22column%22:%22date%22,%22direction%22:%22DESC%22}],%22paging%22:{%22page%22:1,%22itemsPerPage%22:1000},%22search%22:null,%22params%22:null}`,
    {
      method: "GET",
      headers: {
        Cookie: `${cookie.name}=${cookie.value}`,
        Authorization: email,
      },
    }
  );
  const data = await response.json();
  return data;
}
