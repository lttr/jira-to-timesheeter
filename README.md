# Jira to Timesheeter

A tool for displaying a big table with all the logged timesheet items and some stats on top of that (like how many hours one has already done this year).

A tool for copying timesheets from Jira (with plugin Clockwork) to Hanaboso Timesheeter.

Also a simple project for playing with Deno and [Deno Deploy](https://deno.com/deploy/).

## Requirements

Install Deno.

## Usage

### Local

Before running locally create a file `params.json` based on `params.json.sample` with your values.

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

Its main route expects a POST request with the same object that is in `params.json.sample`.

This request can be called e.g. every day from a cron job.

## Features

It fetches all records for the last X days from Clockwork plugin from Jira and tries to idempotently insert them into Timesheeter.

