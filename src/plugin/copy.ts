import run from './script';
import * as path from 'path';

export default async function (context: BuildContext, {source, destination}: { 
    source: string; 
    destination: string;
}) {
    const dest = destination || '.';
    console.log(`copy ${source} to ${dest}`)
    await run(context, [
        `cp ${JSON.stringify(path.resolve(context.workFolder, source))} ${JSON.stringify(path.resolve(context.workFolder, dest))}`
    ]);
}