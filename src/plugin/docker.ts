import run from './script';
import * as pathlib from 'path';

type Context = {
    workfolder: string;
};

export default async function (context: Context, { cmd, dockerfile, path, tag }: { 
    cmd: string, 
    dockerfile: string; 
    path: string; 
    tag: string;
}) {
    switch (cmd) {
        case 'build': await build(context, dockerfile, tag, path || '.'); break;
        default : throw `${cmd} not know`
    }
}

async function build(context: Context, dockerfile: string, tag: string, path: string) {
    const dockerfilename = dockerfile && `dockerfile_${Math.round(Math.random()*10000)}` || 'Dockerfile';
    const dockerpath = pathlib.resolve(context.workfolder, dockerfilename);
    const pathname = pathlib.resolve(context.workfolder, path || '.');
    const tagname = tag?.split(/\s+/)[0];

    await run(context, [ 
        dockerfile && `cp ${dockerfile} ${dockerpath}` || '',
        `docker build -f ${dockerpath} ${tagname && `-t ${tagname}`} ${pathname}`
    ]);
}