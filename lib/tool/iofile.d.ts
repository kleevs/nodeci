export declare class IOFileSync {
    write(filename: string, content: string): void;
    read(filename: string): string;
    mkdir(dirname: string): void;
    exist(dirname: any): boolean;
}
export declare class IOFileAsync {
    write(filename: string, content: string): Promise<void>;
    read(filename: string): Promise<string>;
    mkdir(dirname: string): Promise<void>;
    exist(dirname: any): Promise<boolean>;
    appendFile(filename: string, content: string): void;
}
