"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
var express = require("express");
var bodyParser = require("body-parser");
function start(port, socketserver) {
    var routage = {
        buildList: "/pipeline",
        build: "/pipeline/:name",
        buildInstance: "/pipeline/:name/:tag"
    };
    var app = express();
    var io = require('socket.io-client');
    var socket = io(socketserver);
    socket.on('connect', function () {
        console.log("connected");
    });
    socket.on('disconnect', function () {
        console.log('diconnect');
    });
    app.use(bodyParser.json());
    app.get(routage.buildList, function (req, res) {
        console.log("List des builds");
        res.end();
    });
    app.put(routage.build, function (req, res) {
        console.log("Cr\u00E9ation d'un build.");
        socket.emit('create-build', {
            name: req.params.name,
            config: req.body
        });
        res.end();
    });
    app.get(routage.build, function (req, res) {
        console.log("Obtient la config d'un build.");
        res.end();
    });
    app.post(routage.build, function (req, res) {
        var _a;
        console.log("Lancement d'un build. " + req.params.name);
        socket.emit('launch-build', {
            pipeline: req.params.name,
            agent: ((_a = req.body) === null || _a === void 0 ? void 0 : _a.agent) || null
        });
        res.end();
    });
    app.get(routage.build, function (req, res) {
        console.log("Liste de toutes les instances d'un build.");
        res.end();
    });
    app.get(routage.buildInstance, function (req, res) {
        console.log("Log de l'instance de build");
        res.end();
    });
    app.listen(port, function () {
        console.log("listening at http://localhost:" + port);
        socket.emit('admin');
    });
    console.log("connecting to engine...");
}
exports.start = start;
