#!/usr/bin/env node

const { upload } = require('../dist/index');
upload().then(() => process.exit());
