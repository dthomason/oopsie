#!/usr/bin/env node
// What does pconsole do and/or mean?

import path from 'path';

import execa from 'execa';

execa(
  'node',
  [
    '--experimental-repl-await',
    path.join(__dirname, 'cli.js'),
    ...process.argv.slice(2),
  ],
  {
    env: process.env,
    stdio: 'inherit',
  },
);
