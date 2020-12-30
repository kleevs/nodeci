export default function (context: PluginContext, { repository, commit, destination }: {
    repository: string;
    commit: string;
    destination: string;
}): Promise<void>;
