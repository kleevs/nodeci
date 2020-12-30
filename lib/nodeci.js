"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var process = require("process");
var path = require("path");
var main_1 = require("./startup/main");
var dirname = process.cwd();
var config = tslib_1.__assign({ port: { http: 80, https: 443 }, pipeline: {} }, (function () {
    try {
        return require(path.resolve(dirname, "nodeci.config"));
    }
    catch (e) {
        return {};
    }
})());
main_1.start(config);
