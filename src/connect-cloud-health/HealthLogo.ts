import { log } from 'console';
import { readFileSync } from 'fs';
import { join } from 'path';

export const logo: string | undefined = (() => {
  try {
    return readFileSync(join(__dirname, 'healthcheck.svg'), 'utf-8');
  } catch (err) {
    return undefined;
  }
})();
