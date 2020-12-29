"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWorkingFolder = void 0;
var fs = require("fs");
var path = require("path");
function createWorkingFolder(rootDir) {
    var id = (function () {
        var tmp = null;
        while (!tmp || fs.existsSync("./.nodeci/work/" + tmp)) {
            var date = new Date();
            var strDate = "" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes();
            tmp = "" + strDate + Math.round(Math.random() * 1000);
        }
        return tmp;
    })();
    var workingFolder = "./.nodeci/work/" + id;
    var workingFolderAbsolutePath = path.resolve(rootDir, workingFolder);
    fs.mkdirSync(workingFolder, { recursive: true });
    fs.mkdirSync(path.resolve(workingFolder, 'build'), { recursive: true });
    return { workingFolderAbsolutePath: workingFolderAbsolutePath, id: id };
}
exports.createWorkingFolder = createWorkingFolder;
