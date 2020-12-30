export default function (context: BuildContext, { repository, commit, destination }: {
    repository: string;
    commit: string;
    destination: string;
}): Promise<void>;
