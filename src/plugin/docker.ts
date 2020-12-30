import run from './script';
import * as pathlib from 'path';
import copy from './copy';

export default async function (context: BuildContext, { cmd, dockerfile, path, tag }: { 
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

async function build(context: BuildContext, dockerfile: string, tag: string, path: string) {
    const dockerfilename = dockerfile && `dockerfile_${Math.round(Math.random()*10000)}` || 'Dockerfile';
    const dockerpath = pathlib.resolve(context.workFolder, dockerfilename);
    const pathname = pathlib.resolve(context.workFolder, path || '.');
    const tagname = tag?.split(/\s+/)[0];

    if (dockerfile) {
        await copy(context, { source: dockerfile, destination: dockerpath });
    }
    await run(context, [ 
        `docker build -f ${dockerpath} ${tagname && `-t ${tagname}`} ${pathname}`
    ]);
}