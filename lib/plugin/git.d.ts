declare type Context = {
    workfolder: string;
};
export default function (context: Context, { repository, commit, destination }: {
    repository: string;
    commit: string;
    destination: string;
}): Promise<void>;
export {};
