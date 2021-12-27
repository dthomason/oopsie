import { REPLServer } from 'repl';

// import { PrismaClient } from '@prisma/client';

import db from '../src/orm';

import { makeTag } from './sh';

export function loadContext(r: REPLServer): any {
  for (const p of Object.keys(require.cache)) {
    delete require.cache[p];
  }

  r.context.sh = makeTag('');
  r.context.db = makeTag('db ', (command: any) => {
    if (command === 'db push' || command === 'generate') {
      loadContext(r);
    }
  });
  r.context.db = db;
}

