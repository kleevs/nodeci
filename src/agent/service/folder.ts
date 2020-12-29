import * as fs from 'fs';
import * as path from 'path';

export function createWorkingFolder(rootDir: string) {
    const id = (() => { 
        let tmp: string = null;
        while (!tmp || fs.existsSync(`./.nodeci/work/${tmp}`)) {
            const date = new Date();
            const strDate = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}${date.getHours()}${date.getMinutes()}`;
            tmp = `${strDate}${Math.round(Math.random()*1000)}`;
        }
        return tmp;
    })();
    const workingFolder = `./.nodeci/work/${id}`;
    const workingFolderAbsolutePath = path.resolve(rootDir, workingFolder);
    fs.mkdirSync(workingFolder, { recursive: true });
    fs.mkdirSync(path.resolve(workingFolder, 'build'), { recursive: true });
    return { workingFolderAbsolutePath, id:  id};
}