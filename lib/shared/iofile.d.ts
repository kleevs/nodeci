export declare function writeSync(filename: string, content: string): void;
export declare function readSync(filename: string): string;
export declare function write(filename: string, content: string): Promise<void>;
export declare function read(filename: string): Promise<string>;
export declare function mkdirSync(dirname: string): void;
export declare function appendFile(filename: string, content: string): void;
