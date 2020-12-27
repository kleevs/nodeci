import run from './script';

type Context = {
    workfolder: string;
};

export default async function (context: Context, cmd: string, dockerfile: string) {
    switch (cmd) {
        case 'build': await build(context, dockerfile); break;
        default : throw `${cmd} not know`
    }
}

async function build(context: Context, dockerfile: string) {
    const dockerfilename = `dockerfile_${Math.round(Math.random()*10000)}`;
    await run(context, 
        `cp ${dockerfile} ${context.workfolder}/${dockerfilename}`,
        `cat ${context.workfolder}/${dockerfilename}`
    );
}