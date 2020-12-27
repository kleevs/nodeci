import * as fs from 'fs';

export function getReadOnlyPipeline(config: Config): Promise<Pipeline[]> {
    return new Promise((resolve) => {
        const result: Pipeline[] = [];
        for (var name in config.socket.pipeline) {
            config.socket.pipeline[name];
            fs.readFile(`${config.socket.pipeline[name]}`, 'utf8', (err,data) => {
                if (err) {
                    console.log(err);
                } else {
                    result.push(JSON.parse(data));
                }
            });
        }
        resolve(result);
    });
}