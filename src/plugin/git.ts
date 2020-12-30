import run from './script';

export default async function (context: PluginContext, {repository, commit, destination}: { 
    repository: string;
    commit: string; 
    destination: string;
}) {
    const dest = destination || 'git_src';
    await run(context, [
        `git clone ${repository} ${dest};`,
        `cd ./${dest};`,
        commit && `git checkout ${commit}` || ''
    ]);
}