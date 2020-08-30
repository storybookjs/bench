#!/usr/bin/env node

const { main } = require('../dist/index.js');
main()
  .then(() => process.exit())
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
