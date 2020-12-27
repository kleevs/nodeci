import run from './script';

type Context = {
    workfolder: string;
};

export default async function (context: Context, {repository, commit, destination}: { 
    repository: string;
    commit: string; 
    destination: string;
}) {
    const dest = destination || 'git_src';
    await run(context, [
        `cd ${context.workfolder}`,
        `git clone ${repository} ${dest};`,
        `cd ./${dest};`,
        commit && `git checkout ${commit}` || ''
    ]);
}