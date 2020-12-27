"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var service_1 = require("./engine/service");
var service_2 = require("./agent/service");
var app_1 = require("./admin/service/app");
var process = require("process");
var path = require("path");
var config_1 = require("./engine/service/config");
var dirname = process.cwd();
var config = config_1.getConfig((function () {
    try {
        return require(path.resolve(dirname, "nodeci.config"));
    }
    catch (e) { }
})() || {});
var socketserver = "ws://localhost:" + config.socket.port;
service_1.start(config.socket.port, dirname, config);
service_2.start(socketserver, 'self-hosted', dirname);
app_1.start(config.api.port, socketserver);
