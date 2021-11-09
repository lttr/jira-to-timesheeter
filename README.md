# Jira to Timesheeter

A tool for copying timesheets from Jira (with plugin Clockwork) to Hanaboso Timesheeter.

Also a simple project for playing with Deno and [Deno Deploy](https://deno.com/deploy/).

## Requirements

Install Deno.

## Usage

### Local

Before running locally create a file `params.json` based on `params.json.sample` with your values.

You can perform a dry run by adding `--dry-run` flag:

```
deno run -A --unstable local.js --dry-run
```

### Server

A server can be started with 

```
deno run -A --unstable server.js
```

Or deploy it to Deno Deploy.

Its main route expects a POST request with the same object that is in `params.json.sample`.

This request can be called e.g. every day from a cron job.

## Features

It fetches all records for the last 7 days from Clockwork plugin from Jira and tries to idempotently insert them into Timesheeter.

