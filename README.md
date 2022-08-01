# Jira to Timesheeter

A tool that helps me manage my time tracking records.

It is specific to tools that are used at [Hanaboso](https://hanaboso.com/)
however there is some interesting logic that can be used elsewhere (like an
algorithm for counting working hours in any given year).

## Features

- Renders a big table with all the tracking records and some stats on top of
  that (like how many hours one has already done this year).
- A tool for copying timesheets from Jira (with plugin Clockwork) to Hanaboso
  Timesheeter.

## Tech

- Simple
  [http](https://doc.deno.land/https://deno.land/std@0.144.0/http/mod.ts/~/serve)
  server on [Deno](https://deno.land).
- [uhtml-ssr](https://github.com/WebReflection/uhtml-ssr) library for templating
  based on tagged tamplate literals
- [Temporal](https://tc39.es/proposal-temporal/docs/) polyfill for playing with
  dates
- Running on [Deno Deploy](https://deno.com/deploy/).

## Requirements

Install Deno.

## Usage

### Local

Before running locally create a file `params.json` based on `params.json.sample`
with your values.

You can perform a dry run by adding `--dry-run` flag:

```
deno run -A --unstable local.ts --dry-run
```

### Server

A server can be started (with autoreload)

```
make dev
```

Or deploy it to Deno Deploy.

Its main route expects a POST request with the same object that is in
`params.json.sample`.

This request can be called e.g. every day from a cron job.

Its main route expects a GET request which will return a page full of data from
Timesheeter. Expects credentials from HTTP Basic auth.
