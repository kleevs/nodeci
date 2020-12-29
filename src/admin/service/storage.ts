import { mkdirSync, write, read } from '../../shared/iofile';
import { EventManager } from "../../shared/event-manager";

let users: Users = {
}

const manager = new EventManager<Users>();

export function updateUsers(callback: (v: Users) => Users) {
    manager.fire(save(users = callback(users)));
}

export function onUpdateUsers(callback: (v: Users) => void) {
    callback(users);
    return manager.on(callback);
}

export function getUsers() {
    return {...users};
}

function save(users: Users) {
    mkdirSync(`.nodeci`);
    write(`.nodeci/users.data`, JSON.stringify(users));
    return users;
} 

read(`.nodeci/users.data`).then((str) => {
    updateUsers(users => ({
        ...users,
        ...JSON.parse(str)
    }));
})
.catch(() => {});