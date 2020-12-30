import * as process from 'process';
import * as path from 'path';
import { start } from './startup/main';

const dirname = process.cwd();
const config: Config = {
    port: { http: 80, https: 443 },
    pipeline: {},
    ...(() => {
        try {
            return require(path.resolve(dirname, `nodeci.config`));
        } catch (e) {
            return {}
        }
    })()
};

start(config);