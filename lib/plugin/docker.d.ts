export default function (context: BuildContext, { cmd, dockerfile, path, tag }: {
    cmd: string;
    dockerfile: string;
    path: string;
    tag: string;
}): Promise<void>;
