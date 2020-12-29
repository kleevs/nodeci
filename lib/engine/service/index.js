"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var tslib_1 = require("tslib");
var agent_1 = require("./agent");
var queue_1 = require("./queue");
var storage_1 = require("./storage");
var pipeline_1 = require("./pipeline");
var iofile_1 = require("../../shared/iofile");
var event_manager_1 = require("../../shared/event-manager");
var storage_data_1 = require("./storage-data");
function start(port, rootDir, config) {
    var listeners = {};
    var globalQueue = new queue_1.Queue();
    var agentNames = {};
    var io = require('socket.io')(port);
    var logManager = new event_manager_1.EventManager();
    logManager.on(function (_a) {
        var id = _a.id, message = _a.message;
        storage_1.appendLog({ id: id, message: message });
        console.log(message);
    });
    logManager.on(function (_a) {
        var id = _a.id, pipeline = _a.pipeline, agent = _a.agent;
        storage_data_1.updateStorage(function (storage) {
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
        });
    });
    iofile_1.mkdirSync('./.nodeci/logs');
    pipeline_1.getReadOnlyPipeline(rootDir, config).then(function (array) {
        var result = {};
        array.forEach(function (_) {
            result[_.name] = _.config;
        });
        storage_data_1.updateStorage(function (storage) { return (tslib_1.__assign(tslib_1.__assign({}, storage), { pipeline: tslib_1.__assign(tslib_1.__assign({}, storage.pipeline), result) })); });
    });
    console.log("listening on port " + port);
    io.on('connection', function (socket) {
        listeners[socket.id] = {
            isAgent: false,
            isAdmin: false,
            agent: null
        };
        socket.on('disconnect', function () {
            console.log("disconnected " + socket.id);
            delete listeners[socket.id];
        });
        // if it's build agent
        socket.on('agent', function (msg) {
            var name = msg.name;
            console.log("an agent connected " + socket.id + " " + name);
            var agent = listeners[socket.id];
            agent.isAgent = true;
            agent.agent = new agent_1.Agent(socket, function (me) {
                globalQueue.shift(function (config) {
                    if (!me.isBusy()) {
                        me.run(config);
                        return Promise.resolve(true);
                    }
                    return Promise.resolve(false);
                });
            }, function (v) {
                logManager.fire(tslib_1.__assign(tslib_1.__assign({}, v), { agent: name }));
            });
            agentNames[name] = socket.id;
        });
        // if it's admin agent
        socket.on('admin', function () {
            console.log("an admin connected " + socket.id);
            listeners[socket.id].isAdmin = true;
            storage_data_1.onUpdateStorage(function (storage) {
                socket.emit('storage', storage);
            });
            // create a pipeline
            socket.on('create-build', function (pipeline) {
                storage_data_1.updateStorage(function (storage) {
                    var _a;
                    return (tslib_1.__assign(tslib_1.__assign({}, storage), { pipeline: tslib_1.__assign(tslib_1.__assign({}, storage.pipeline), (_a = {}, _a[pipeline.name] = pipeline.config, _a)) }));
                });
            });
            // launch a pipeline
            socket.on('launch-build', function (build) {
                var config = storage_data_1.getStorage().pipeline[build.pipeline];
                var agentName = build.agent;
                var metadata = { config: config, name: build.pipeline };
                if (agentName && agentNames[agentName] && listeners[agentNames[agentName]]) {
                    listeners[agentNames[agentName]].agent.run(metadata);
                }
                else {
                    globalQueue.push(metadata);
                    for (var id in listeners) {
                        if (listeners[id].isAgent) {
                            if (!listeners[id].agent.isBusy()) {
                                listeners[id].agent.doWork();
                            }
                        }
                    }
                }
            });
        });
    });
}
exports.start = start;
