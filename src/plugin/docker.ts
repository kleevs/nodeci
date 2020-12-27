import run from './script';
import * as pathlib from 'path';

type Context = {
    workfolder: string;
};

export default async function (context: Context, { cmd, dockerfile, path }: { 
    cmd: string, 
    dockerfile: string; 
    path: string; 
}) {
    switch (cmd) {
        case 'build': await build(context, dockerfile, path || '.'); break;
        default : throw `${cmd} not know`
    }
}

async function build(context: Context, dockerfile: string, path: string) {
    const dockerfilename = `dockerfile_${Math.round(Math.random()*10000)}`;
    const dockerpath = pathlib.resolve(context.workfolder, dockerfilename);
    const pathname = pathlib.resolve(context.workfolder, path || '.');
    await run(context, [ 
        `cp ${dockerfile || 'Dockerfile'} ${dockerpath}`,
        `docker build -f ${dockerpath} ${pathname}`
    ]);
}