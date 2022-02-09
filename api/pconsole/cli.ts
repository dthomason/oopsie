#!/usr/bin/env node
import repl from 'repl';

import { cac } from 'cac';

import { version } from '../package.json';

import { loadContext } from './utils';

const cli = cac(`prisma-repl`);

cli.option('--url <url>', 'Override database URL');

cli.version(version);
cli.help();
const { options }: { options: { url?: string } } = cli.parse();

if (options.url) {
  // This is super odd. Setting an env var value in code.
  process.env.DATABASE_URL = options.url;
}

const r = repl.start('> ');

r.on('exit', () => process.exit());

r.setupHistory('node_modules/.prisma-repl-history', err => {
  if (err) console.error(err);
});

const initContext = (): any => loadContext(r);

r.defineCommand('reload', {
  help: 'Remove cache for loaded modules',
  action() {
    this.clearBufferedCommand();
    initContext();
    this.displayPrompt();
  },
});

initContext();
