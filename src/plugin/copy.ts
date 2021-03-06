import run from './script';
import * as path from 'path';

export default async function (context: PluginContext, {source, destination}: { 
    source: string; 
    destination: string;
}) {
    const dest = destination || '.';
    console.log(`copy ${source} to ${dest}`)
    await run(context, [
        `cp ${JSON.stringify(path.resolve(context.rootFolder, source))} ${JSON.stringify(path.resolve(context.workFolder, dest))}`
    ]);
}