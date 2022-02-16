import { easter, Temporal } from "../deps.ts";

function getBankHolidays(year) {
  // Velký pátek
  // Velikonoční pondělí
  const easterSunday = Temporal.PlainDate.from(easter.easter(year));
  const easterFriday = easterSunday.subtract({ days: 2 });
  const easterMonday = easterSunday.add({ days: 1 });
  const floating = [easterMonday, easterFriday];

  const permanent = [
    { day: "1", month: "1" }, //	Nový rok
    { day: "1", month: "5" }, //	Svátek práce
    { day: "8", month: "5" }, //	Den vítězství
    { day: "5", month: "7" }, //	Den slovanských věrozvěstů Cyrila a Metoděje
    { day: "6", month: "7" }, //	Den upálení mistra Jana Husa
    { day: "28", month: "9" }, //	Den české státnosti
    { day: "28", month: "10" }, //	Den vzniku samostatného československého státu
    { day: "17", month: "11" }, //	Den boje za svobodu a demokracii
    { day: "24", month: "12" }, //	Štědrý den
    { day: "25", month: "12" }, //	1. svátek vánoční
    { day: "26", month: "12" }, //	2. svátek vánoční
  ];

  return [
    ...floating,
    ...permanent.map((date) => Temporal.PlainDate.from({ year, ...date })),
  ];
}

export function dateRange(from, to) {
  let current = Temporal.PlainDate.from(from);
  const range = [current];
  while (!current.equals(to)) {
    current = current.add({ days: 1 });
    range.push(current);
  }
  return range;
}

function isEndOfTheWeek(date) {
  return date.dayOfWeek === 6 || date.dayOfWeek === 7;
}

function isBankHoliday(date) {
  return getBankHolidays(date.year).some((x) => date.equals(x));
}

export function isHoliday(date) {
  return isEndOfTheWeek(date) || isBankHoliday(date);
}

export function isWorkDay(date) {
  return !isHoliday(date);
}

export const monthAgo = Temporal.Now.plainDateISO().subtract({ months: 2 });

export const tenDaysAgo = Temporal.Now.plainDateISO().subtract({ days: 10 });

export const today = Temporal.Now.plainDateISO();

export function formatCzechDate(date) {
  const options = { month: "numeric", day: "numeric" };
  return Intl.DateTimeFormat("cs", options).format(
    new Date(date.year, date.month - 1, date.day)
  );
}

export function formatCzechWeekDay(date) {
  const options = { weekday: "long" };
  return Intl.DateTimeFormat("cs", options).format(
    new Date(date.year, date.month - 1, date.day)
  );
}
