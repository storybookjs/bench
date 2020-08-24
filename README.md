# Storybook Bench

A benchmark for Storybook. Usage:

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

It outputs all results to a file, `bench.csv`.
