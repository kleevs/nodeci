"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var agent_1 = require("./agent");
var queue_1 = require("./queue");
var storage_1 = require("./storage");
var pipeline_1 = require("./pipeline");
var iofile_1 = require("../../shared/iofile");
function start(port, rootDir, config) {
    var listeners = {};
    var globalQueue = new queue_1.Queue();
    var agentNames = {};
    var pipelines = {};
    var io = require('socket.io')(port);
    iofile_1.mkdirSync('./.nodeci/logs');
    pipeline_1.getReadOnlyPipeline(rootDir, config).then(function (array) {
        array.forEach(function (_) {
            if (!pipelines[_.name]) {
                pipelines[_.name] = _.config;
            }
        });
    }).then(function () {
        storage_1.read().then(function (_) {
            for (var i in _) {
                console.log(_);
                if (!pipelines[i]) {
                    pipelines[i] = _[i];
                }
            }
        });
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
            agent.agent = new agent_1.Agent(rootDir, socket, function (me) {
                globalQueue.shift(function (config) {
                    if (!me.isBusy()) {
                        me.run(config);
                        return Promise.resolve(true);
                    }
                    return Promise.resolve(false);
                });
            });
            agentNames[name] = socket.id;
        });
        // if it's admin agent
        socket.on('admin', function () {
            console.log("an admin connected " + socket.id);
            listeners[socket.id].isAdmin = true;
            // create a pipeline
            socket.on('create-build', function (pipeline) {
                pipelines[pipeline.name] = pipeline.config;
                storage_1.write(pipelines);
            });
            // launch a pipeline
            socket.on('launch-build', function (build) {
                var config = pipelines[build.pipeline];
                var agentName = build.agent;
                if (agentName && agentNames[agentName] && listeners[agentNames[agentName]]) {
                    listeners[agentNames[agentName]].agent.run(config);
                }
                else {
                    globalQueue.push(config);
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
