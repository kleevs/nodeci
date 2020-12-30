import * as fs from 'fs';

export class IOFileSync {
    write(filename: string, content: string): void {
        fs.writeFileSync(`${filename}`, content, 'utf8');
    } 

    read(filename: string): string {
        if (fs.existsSync(filename)){
            return fs.readFileSync(`${filename}`, 'utf8').toString();
        }
        return null;
    }

    mkdir(dirname: string) {
        if (!fs.existsSync(dirname)){
            fs.mkdirSync(dirname, { recursive: true });
        }
    }

    exist(dirname) {
        return fs.existsSync(dirname);
    }
}

export class IOFileAsync {    
    write(filename: string, content: string) {
        return new Promise<void>((resolve, reject) => fs.writeFile(`${filename}`, content, 'utf8', (err) => {
            if (err) reject(err);
            resolve();
        }));
    } 
    
    read(filename: string) {
        return new Promise<string>((resolve, reject) => {
            if (fs.existsSync(filename)){
                fs.readFile(`${filename}`, 'utf8', (err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            } else {
                resolve(null);
            }
        });
    }
    
    mkdir(dirname: string) {
        return new Promise<void>((resolve, reject) => {
            if (!fs.existsSync(dirname)) {
                fs.mkdir(dirname, { recursive: true }, (err) => {
                    if (err) reject(err);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    exist(dirname) {
        return new Promise<boolean>((resolve) => { 
            fs.access(dirname, (err) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }
    
    appendFile(filename: string, content: string) {
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
}