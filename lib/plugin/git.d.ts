declare type Context = {
    workfolder: string;
};
export default function (context: Context, repo: string, commit: string): Promise<void>;
export {};
