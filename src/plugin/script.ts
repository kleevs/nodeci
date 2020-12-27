import { execute } from '../shared/command'

export default async function (context, commands: string[]) {
    await execute(commands?.join(";"));
}