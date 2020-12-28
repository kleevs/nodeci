declare type Context = {
    workfolder: string;
};
export default function (context: Context, { cmd, dockerfile, path, tag }: {
    cmd: string;
    dockerfile: string;
    path: string;
    tag: string;
}): Promise<void>;
export {};
