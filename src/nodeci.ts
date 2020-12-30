import { start as startEngine } from './engine/service';
import { start as startAgent } from './agent/service';
import { start as startAdmin } from './admin/service/app';
import { getPort } from 'portfinder';
import * as process from 'process';
import * as path from 'path';
import { getConfig } from './engine/service/config';

const dirname = process.cwd()
const config = getConfig((() => {
    try {
        return require(path.resolve(dirname, `nodeci.config`));
    } catch (e) {}
})() || {});

getPort((err, port) => {
    const socketserver = `ws://localhost:${port}`;
    startEngine(port, dirname, config);
    startAgent(socketserver, 'self-hosted', dirname);
    startAdmin(config, socketserver);
})