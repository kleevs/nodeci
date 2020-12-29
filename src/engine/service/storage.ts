import * as fs from 'fs';
import * as path from 'path';
import { appendFile } from '../../shared/iofile';

const pathStorage = '.nodeci/storage';

export function write(pipeline: {[k:string]: PipelineConfig}): void {
    if (!fs.existsSync(pathStorage)) {
        fs.mkdirSync(pathStorage, { recursive: true });
    }

    fs.writeFile(`${pathStorage}/.pipeline`, JSON.stringify(pipeline), 'utf8', (err) => {
        if (err) return console.log(err);
    });
} 

export function read(): Promise<{[k:string]: PipelineConfig}> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(pathStorage)) {
            fs.readFile(`${pathStorage}/.pipeline`, 'utf8', (err,data) => {
                if (err) {
                    console.log(err);
                    reject();
                } else {
                    resolve(JSON.parse(data));
                }
            });
        } else {
            resolve({});
        }
    })
}

export function appendLog({id, message}: { id: string, message: string }) {
    appendFile(`.nodeci/logs/${id}.log.txt`, `${message}\r\n`);
}

export function writeLogMetadata(metadata: LogMetadata): void {
    if (!fs.existsSync(pathStorage)) {
        fs.mkdirSync(pathStorage, { recursive: true });
    }

    fs.writeFile(`${pathStorage}/.log`, JSON.stringify(metadata), 'utf8', (err) => {
        if (err) return console.log(err);
    });
} 

export function readLogMetadata(): Promise<LogMetadata> {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(pathStorage)) {
            fs.readFile(`${pathStorage}/.log`, 'utf8', (err,data) => {
                if (err) {
                    console.log(err);
                    reject();
                } else {
                    resolve(JSON.parse(data));
                }
            });
        } else {
            resolve({});
        }
    })
}