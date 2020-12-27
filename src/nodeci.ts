import { start as startEngine } from './engine/service';
import { start as startAgent } from './agent/service';
import { start as startAdmin } from './admin/service/app';
import * as process from 'process';

const [portSocket, portApi] = process.argv.slice(2);
const socketserver = `ws://localhost:${portSocket}`;
const dirname = process.cwd()
const config = require('nodeci.config.js');

startEngine(+portSocket, config);
startAgent(socketserver, 'self-hosted', dirname);
startAdmin(+portApi, socketserver);