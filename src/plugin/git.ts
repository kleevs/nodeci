import run from './script';

type Context = {
    workfolder: string;
};

export default async function (context: Context, repo: string, commit: string) {
    await run(context, 
        `cd ${context.workfolder}`,
        `git clone ${repo} git_src;`,
        `cd ./git_src;`,
        `git checkout ${commit}`
    );
}