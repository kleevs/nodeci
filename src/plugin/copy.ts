import run from './script';
import * as path from 'path';

type Context = {
    workfolder: string;
};

export default async function (context: Context, {source, destination}: { 
    source: string; 
    destination: string;
}) {
    const dest = destination || '.';
    await run(context, [
        `cp ${source} ${path.resolve(context.workfolder, dest)}`
    ]);
}