# v0.7.3 (Mon Apr 18 2022)

#### 🐛 Bug Fix

- Use `yarn storybook` for `sb dev` compatibility [#9](https://github.com/storybookjs/bench/pull/9) ([@shilman](https://github.com/shilman))

#### Authors: 1

- Michael Shilman ([@shilman](https://github.com/shilman))

---

# v0.7.1 (Wed Apr 13 2022)

#### 🐛 Bug Fix

- Update README.md [#8](https://github.com/storybookjs/bench/pull/8) ([@shilman](https://github.com/shilman))
- Fix prettier formatting [#7](https://github.com/storybookjs/bench/pull/7) ([@shilman](https://github.com/shilman))

#### ⚠️ Pushed to `master`

- Update README.md ([@shilman](https://github.com/shilman))

#### Authors: 1

- Michael Shilman ([@shilman](https://github.com/shilman))

---

# v0.7.1 (Wed Apr 13 2022)

#### 🐛 Bug Fix

- Fix prettier formatting [#7](https://github.com/storybookjs/bench/pull/7) ([@shilman](https://github.com/shilman))

#### ⚠️ Pushed to `master`

- Update README.md ([@shilman](https://github.com/shilman))

#### Authors: 1

- Michael Shilman ([@shilman](https://github.com/shilman))

---

# v0.7.0 (Tue Apr 12 2022)

#### 🚀 Enhancement

- Add flags to skip some benchmarks [#1](https://github.com/storybookjs/bench/pull/1) ([@hipstersmoothie](https://github.com/hipstersmoothie))

#### 🐛 Bug Fix

- Add auto release [#6](https://github.com/storybookjs/bench/pull/6) ([@shilman](https://github.com/shilman))
- Support running against vite-builder projects [#5](https://github.com/storybookjs/bench/pull/5) ([@IanVS](https://github.com/IanVS))
- Add support of Yarn 2+ [#3](https://github.com/storybookjs/bench/pull/3) ([@gaetanmaisse](https://github.com/gaetanmaisse))
- Set Node requirement to 12 in package.json [#2](https://github.com/storybookjs/bench/pull/2) ([@gaetanmaisse](https://github.com/gaetanmaisse))

#### ⚠️ Pushed to `master`

- Fix vendors bundle size for manager/preview in webpack5 ([@shilman](https://github.com/shilman))
- Update for manager-webpack5 ([@shilman](https://github.com/shilman))
- Don't install addon-bench multiple times ([@shilman](https://github.com/shilman))
- 0.6.4 ([@shilman](https://github.com/shilman))
- Support webpack5 manager in a hacky way ([@shilman](https://github.com/shilman))
- 0.6.3 ([@shilman](https://github.com/shilman))
- 0.6.2 ([@shilman](https://github.com/shilman))
- Fix bundle size to work if no sourcemaps are generated ([@shilman](https://github.com/shilman))
- Update startStorybook.ts ([@shilman](https://github.com/shilman))
- 0.6.1 ([@shilman](https://github.com/shilman))
- Fix handling for cached manager ([@shilman](https://github.com/shilman))
- 0.6.0 ([@shilman](https://github.com/shilman))
- Don't install anything in no install command is provided ([@shilman](https://github.com/shilman))
- 0.5.1 ([@shilman](https://github.com/shilman))
- Safe DU for removed DLLs ([@shilman](https://github.com/shilman))
- 0.5.0 ([@shilman](https://github.com/shilman))
- Accept extra SB flags ([@shilman](https://github.com/shilman))
- Handle no GCP credentials ([@shilman](https://github.com/shilman))
- 0.4.0 changelog ([@shilman](https://github.com/shilman))
- Upload based on SB_BENCH_UPLOAD env variable ([@shilman](https://github.com/shilman))
- 0.3.2 changelog ([@shilman](https://github.com/shilman))
- Add CIRCLE_BRANCH, CIRCLE_SHA1 support ([@shilman](https://github.com/shilman))
- 0.3.1 changelog ([@shilman](https://github.com/shilman))
- Fix bundle sizes to match upload ([@shilman](https://github.com/shilman))
- Fix error handling ([@shilman](https://github.com/shilman))
- 0.3.0 changelog ([@shilman](https://github.com/shilman))
- Upload results to bigtable ([@shilman](https://github.com/shilman))
- 0.2.5 changelog ([@shilman](https://github.com/shilman))
- Exit on completion ([@shilman](https://github.com/shilman))
- 0.2.4 changelog ([@shilman](https://github.com/shilman))
- Resolve render on exit ([@shilman](https://github.com/shilman))
- 0.2.3 changelog ([@shilman](https://github.com/shilman))
- Better logging ([@shilman](https://github.com/shilman))
- 0.2.2 changelog ([@shilman](https://github.com/shilman))
- Close browser asynchronously ([@shilman](https://github.com/shilman))
- 0.2.1 changelog ([@shilman](https://github.com/shilman))
- Args for running puppeteer in CI ([@shilman](https://github.com/shilman))
- 0.2.0 changelog ([@shilman](https://github.com/shilman))
- Use puppeteer to browse storybook for CI ([@shilman](https://github.com/shilman))
- initial commit ([@shilman](https://github.com/shilman))

#### Authors: 4

- Andrew Lisowski ([@hipstersmoothie](https://github.com/hipstersmoothie))
- Gaëtan Maisse ([@gaetanmaisse](https://github.com/gaetanmaisse))
- Ian VanSchooten ([@IanVS](https://github.com/IanVS))
- Michael Shilman ([@shilman](https://github.com/shilman))

---

### 0.6.4

Support webpack5 manager in a hacky way

### 0.6.3

Add yarn2 support

### 0.6.2

Fix bundle size if no sourcemaps are generated

### 0.6.1

Fix handling for cached manager

### 0.6.0

Don't install anything if no install command provided

### 0.5.1

Safe DU for removed DLLs

### 0.5.0

Accept extra SB flags

### 0.4.0

Upload based on SB_BENCH_UPLOAD env variable

### 0.3.2

Add CIRCLE_BRANCH/SHA1 support

### 0.3.1

Fix error handling and bundle size structure

### 0.3.0

Upload results to bigquery

### 0.2.5

Exit on completion

### 0.2.4

Resolve render on exit

### 0.2.3

Better logging

### 0.2.2

Close `puppeteer` browser asynchronously

### 0.2.1

`puppeteer` args for running CI

### 0.2.0

Use `puppeteer` to browse storybook for CI

### 0.1.0

Initial version, logging `install`, `start`, `build`, `browse` to `bench.csv`
