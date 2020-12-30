import * as process from 'process';
import * as path from 'path';
import { start } from './service/main';

const dirname = process.cwd();
const config: Config = {
    port: 80,
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