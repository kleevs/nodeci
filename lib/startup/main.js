"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var tslib_1 = require("tslib");
var path_1 = require("path");
var agent_1 = require("../service/agent");
var admin_1 = require("../service/admin");
var engine_1 = require("../service/engine");
var queue_1 = require("../tool/queue");
var storage_1 = require("../service/storage");
var user_1 = require("../service/user");
var event_manager_1 = require("../tool/event-manager");
var iofile_1 = require("../tool/iofile");
var crypto_1 = require("../tool/crypto");
var express = require("express");
var bodyParser = require("body-parser");
var authorization_1 = require("../middleware/authorization");
var api_1 = require("../server/api");
var content_type_1 = require("../middleware/content-type");
var config_1 = require("../service/config");
var http_1 = require("http");
var runner_1 = require("../tool/runner");
function start(config) {
    var port = config.port.http;
    var ioFileAsync = new iofile_1.IOFileAsync();
    var users = new user_1.User(new event_manager_1.EventManager(), ioFileAsync);
    var agents = {};
    var globalQueue = new queue_1.Queue();
    var cryptoTools = new crypto_1.Crypto();
    var ioFile = new iofile_1.IOFileSync();
    var pathBuilder = {
        resolve: function () {
            var paths = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                paths[_i] = arguments[_i];
            }
            return path_1.resolve.apply(path_1.resolve, paths);
        }
    };
    var pipelineConfig = new config_1.ConfigAccessor(pathBuilder, ioFile).getConfig(config);
    var storage = new storage_1.Storage(pipelineConfig, new event_manager_1.EventManager(), ioFileAsync);
    var user = {
        update: function (callback) { return users.updateUser(callback); }
    };
    var storageAccessor = {
        get: function () { return storage.getStorage(); },
        update: function (callback) { return storage.updateStorage(callback); }
    };
    ioFile.mkdir("./.nodeci/logs");
    var logger = {
        info: function (id, msg) {
            var message = msg === null || msg === void 0 ? void 0 : msg.replace(/\r?\n$/gi, '');
            console.log(message);
            ioFileAsync.appendFile("./.nodeci/logs/" + id + ".log.txt", message + "\r\n");
        }
    };
    var pinger = {
        start: function (pipeline, agent, id) { return storage.updateStorage(function (storage) {
            var _a, _b;
            var file = storage.logs[pipeline] && storage.logs[pipeline][id] && storage.logs[pipeline][id].file;
            return tslib_1.__assign(tslib_1.__assign({}, storage), { logs: tslib_1.__assign(tslib_1.__assign({}, storage.logs), (_a = {}, _a[pipeline] = tslib_1.__assign(tslib_1.__assign({}, storage.logs[pipeline]), (_b = {}, _b[id] = {
                    file: file || "./.nodeci/logs/" + id + ".log.txt",
                    date: {
                        start: 0,
                        end: 0
                    },
                    agent: agent,
                    successfull: true
                }, _b)), _a)) });
        }); }
    };
    var taskFactory = {
        build: function (v) { return new runner_1.Runner(v.buildFolder, v.context, pathBuilder); }
    };
    var engine = new engine_1.Engine(storageAccessor, agents, globalQueue);
    var agent = new agent_1.Agent(process.cwd(), 'self-hosted', ioFile, new queue_1.Queue(), globalQueue, pathBuilder, logger, taskFactory, pinger);
    var admin = new admin_1.Admin(engine, storageAccessor, cryptoTools, ioFile, user);
    agents['self-hosted'] = agent;
    var app = express();
    app.use(authorization_1.basicAuth(function () { return users.getUser(); }));
    app.use(content_type_1.contentType());
    app.use(bodyParser.json());
    api_1.start(app, admin);
    http_1.createServer(app).listen(port, function () {
        console.log("listening at http://localhost:" + port);
    });
}
exports.start = start;
