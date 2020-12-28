declare type Context = {
    workfolder: string;
};
export default function (context: Context, { source, destination }: {
    source: string;
    destination: string;
}): Promise<void>;
export {};
