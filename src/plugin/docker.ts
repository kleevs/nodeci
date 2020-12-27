import run from './script';

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
    await run(context, [ 
        `cp ${dockerfile} ${context.workfolder}/${dockerfilename}`,
        `docker build -f ${context.workfolder}/${dockerfilename} ${path}`
    ]);
}