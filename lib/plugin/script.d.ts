export declare function execute(command: string): any;
export declare function execute(command: string, log: (msg: string) => void): any;
export default function (context: PluginContext, commands: string[]): Promise<void>;
