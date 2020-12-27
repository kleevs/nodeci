declare type Context = {
    workfolder: string;
};
export default function (context: Context, cmd: string, dockerfile: string): Promise<void>;
export {};
