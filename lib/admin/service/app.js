"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var express = require("express");
var bodyParser = require("body-parser");
var iofile_1 = require("../../shared/iofile");
function start(port, socketserver) {
    var routage = {
        pipelineList: "/pipeline",
        build: "/pipeline/:name",
        buildInstance: "/pipeline/:name/:id"
    };
    var app = express();
    var io = require('socket.io-client');
    var socket = io(socketserver);
    var data = {
        storage: null
    };
    socket.on('connect', function () {
        console.log("connected");
    });
    socket.on('disconnect', function () {
        console.log('diconnect');
    });
    socket.on('storage', function (storage) {
        data.storage = storage;
    });
    app.use(bodyParser.json());
    app.get(routage.pipelineList, function (req, res) {
        var result = [];
        for (var pipeline in data.storage.pipeline) {
            result.push(pipeline);
        }
        res.end(JSON.stringify(result));
    });
    app.put(routage.build, function (req, res) {
        socket.emit('create-build', {
            name: req.params.name,
            config: req.body
        });
        res.end();
    });
    app.get(routage.build, function (req, res) {
        var result = [];
        for (var id in data.storage.logs[req.params.name]) {
            var log = data.storage.logs[req.params.name][id];
            result.push({
                id: id,
                date: log.date,
                successfull: log.successfull,
                agent: log.agent
            });
        }
        res.end(JSON.stringify(result));
    });
    app.post(routage.build, function (req, res) {
        var _a;
        socket.emit('launch-build', {
            pipeline: req.params.name,
            agent: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.agent) || null
        });
        res.end();
    });
    app.get(routage.buildInstance, function (req, res) {
        var log = data.storage.logs[req.params.name][req.params.id];
        var result = iofile_1.readSync("" + log.file);
        res.end(result);
    });
    app.listen(port, function () {
        console.log("listening at http://localhost:" + port);
        socket.emit('admin');
    });
    console.log("connecting to engine...");
}
exports.start = start;
