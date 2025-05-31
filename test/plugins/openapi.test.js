'use strict';
/* eslint-disable func-names */

var assert = require('chai').assert;
var restify = require('../../lib/index.js');
var restifyClients = require('restify-clients');
var helper = require('../lib/helper');

var SERVER;
var CLIENT;
var PORT;

describe('openapi plugin', function() {
    beforeEach(function(done) {
        SERVER = restify.createServer({
            dtrace: helper.dtrace,
            log: helper.getLog('server')
        });

        SERVER.get('/foo', function(req, res, next) {
            res.send({ foo: true });
            next();
        });
        SERVER.post('/bar', function(req, res, next) {
            res.send(201, { bar: true });
            next();
        });

        SERVER.use(restify.plugins.openapi({ server: SERVER }));

        SERVER.listen(0, '127.0.0.1', function() {
            PORT = SERVER.address().port;
            CLIENT = restifyClients.createJsonClient({
                url: 'http://127.0.0.1:' + PORT,
                dtrace: helper.dtrace,
                retry: false
            });
            done();
        });
    });

    afterEach(function(done) {
        CLIENT.close();
        SERVER.close(done);
    });

    it('should include all routes in generated spec', function(done) {
        CLIENT.get('/openapi.json', function(err, req, res, obj) {
            assert.ifError(err);
            assert.equal(res.statusCode, 200);
            assert.isObject(obj.paths);
            assert.isObject(obj.paths['/foo']);
            assert.isObject(obj.paths['/bar']);
            assert.isObject(obj.paths['/foo'].get);
            assert.isObject(obj.paths['/bar'].post);
            assert.isObject(obj.paths['/foo'].get.responses);
            assert.isObject(obj.paths['/foo'].get.responses['200']);
            assert.isObject(obj.paths['/bar'].post.responses);
            assert.isObject(obj.paths['/bar'].post.responses['200']);
            done();
        });
    });
});
