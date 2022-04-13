# Storybook Bench

A simple benchmark for Storybook. Usage:

```
sb-bench 'npx sb init'
```

This will:

- Install storybook using `sb init` (or whatever command is provided)
  - Measure install time and size
- Start
  - Measure build time
  - Measure page load time
- Build
  - Measure build time
- Browse
  - Measure page load time
  - Measure bundle sizes

It outputs all results to the files `bench.csv` and `bench.json` and uploads results to a BigQuery data warehouse if `SB_BENCH_UPLOAD` and `GCP_CREDENTIALS` environment variables are set.

## Flags

It also accepts the following flags:

| option          | description                                                                 |
| --------------- | --------------------------------------------------------------------------- |
| --label <label> | Save as <label>.csv/json and upload with <label> if SB_BENCH_UPLOAD is true |
| --no-install    | Do not measure storybook install time                                       |
| --no-start      | Do not measure storybook start time                                         |
| --no-browse     | Do not measure storybook browse time                                        |

## Environment variables

And consumes the following environment variables:

| variable        | description                                                |
| --------------- | ---------------------------------------------------------- |
| SB_BENCH_UPLOAD | Upload results to GCP if set to tue                        |
| GCP_CREDENTIALS | For upload, the GCP credentials to use as stringified JSON |
| CIRCLE_BRANCH   | For upload, the branch if running in Circle CI             |
| CIRCLE_SHA1     | For upload, the commit hash if running in Circle CI        |
