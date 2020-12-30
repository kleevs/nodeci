export default function (context: PluginContext, { cmd, dockerfile, path, tag }: {
    cmd: string;
    dockerfile: string;
    path: string;
    tag: string;
}): Promise<void>;
