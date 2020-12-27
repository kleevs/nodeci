declare type Context = {
    workfolder: string;
};
export default function (context: Context, { cmd, dockerfile, path }: {
    cmd: string;
    dockerfile: string;
    path: string;
}): Promise<void>;
export {};
