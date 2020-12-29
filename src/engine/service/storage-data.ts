import { mkdirSync, write, read } from '../../shared/iofile';
import { EventManager } from "../../shared/event-manager";

let storage: Storage = {
    pipeline: {},
    logs: {}
}

const manager = new EventManager<Storage>();

export function updateStorage(callback: (v: Storage) => Storage) {
    manager.fire(save(storage = callback(storage)));
}

export function onUpdateStorage(callback: (v: Storage) => void) {
    callback(storage);
    return manager.on(callback);
}

export function getStorage() {
    return {...storage};
}

function save(storage: Storage) {
    mkdirSync(`.nodeci`);
    write(`.nodeci/storage.data`, JSON.stringify(storage));
    return storage;
} 

read(`.nodeci/storage.data`).then((str) => {
    updateStorage(storage => ({
        ...storage,
        ...JSON.parse(str)
    }));
})
.catch(() => {});