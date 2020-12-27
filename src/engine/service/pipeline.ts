import * as fs from 'fs';
import * as path from 'path';

export function getReadOnlyPipeline(rootDir: string, config: Config): Promise<Pipeline[]> {
    const result: Promise<Pipeline>[] = [];
    for (let name in config.pipeline) {
        result.push(new Promise((resolve) => {
            const pathfilename = path.resolve(rootDir, config.pipeline[name]);
            fs.readFile(pathfilename, 'utf8', (err,data) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    console.log(`pipeline ${pathfilename} loaded`);
                    resolve({ name: name, config: JSON.parse(data) });
                }
            });
        }));
    }

    return Promise.all(result).then(pipelines => pipelines.filter(_ => !!_))
}