export declare function updateUsers(callback: (v: Users) => Users): void;
export declare function onUpdateUsers(callback: (v: Users) => void): () => void;
export declare function getUsers(): {
    [x: string]: User;
};
