"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var agent_1 = require("./agent");
var queue_1 = require("./queue");
var storage_1 = require("./storage");
function start(port) {
    var listeners = {};
    var globalQueue = new queue_1.Queue();
    var agentNames = {};
    var pipelines = {};
    var io = require('socket.io')(port);
    storage_1.read().then(function (_) {
        for (var i in _) {
            if (!pipelines[i]) {
                pipelines[i] = _[i];
            }
        }
    });
    console.log("listening on port " + port);
    io.on('connection', function (socket) {
        listeners[socket.id] = {
            isAgent: false,
            isAdmin: false,
            agent: null
        };
        socket.on('disconnect', function () {
            console.log("a user disconnected " + socket.id);
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
                console.log("build", pipeline);
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