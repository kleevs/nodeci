import * as fs from 'fs';

export function writeSync(filename: string, content: string): void {
    fs.writeFileSync(`${filename}`, content, 'utf8');
} 

export function readSync(filename: string): string {
    return fs.readFileSync(`${filename}`, 'utf8').toString();
}

export function write(filename: string, content: string) {
    return new Promise<void>((resolve, reject) => fs.writeFile(`${filename}`, content, 'utf8', (err) => {
        if (err) reject(err);
        resolve();
    }));
} 

export function read(filename: string) {
    return new Promise<string>((resolve, reject) => fs.readFile(`${filename}`, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
    }));
}

export function mkdirSync(dirname: string) {
    if (!fs.existsSync(dirname)){
        fs.mkdirSync(dirname, { recursive: true });
    }
}

export function appendFile(filename: string, content: string) {
    new Promise<void>((resolve, reject) => {
        if (!fs.existsSync(filename)){
            fs.writeFile(`${filename}`, content, 'utf8', (err) => {
                if (err) reject(err);
                resolve();
            });
        } else {
            fs.appendFile(filename, content, function (err) {
                if (err) reject(err);
                resolve();
            });
        }
    });
}