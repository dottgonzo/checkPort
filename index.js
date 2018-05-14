"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const async = require("async");
const net = require("net");
function checkPort(port) {
    return new Promise((resolve, reject) => {
        let available = false;
        const s = net.createServer().listen(port, '0.0.0.0');
        s.on('listening', () => {
            available = true;
            s.close();
        });
        s.on('error', () => {
            available = false;
            s.close();
        });
        s.on('close', () => {
            if (available)
                return resolve({ port: port });
            reject('invalid port');
        });
    });
}
exports.checkPort = checkPort;
function checkFreePortFromPool(portPool) {
    return new Promise((resolve, reject) => {
        async.eachSeries(portPool, (p, cb) => {
            checkPort(p).then((port) => {
                if (port)
                    return resolve(port);
            }).catch((err) => {
                cb();
            });
        }, (err) => {
            if (err)
                return reject(err);
            reject('not found');
        });
    });
}
exports.checkFreePortFromPool = checkFreePortFromPool;
