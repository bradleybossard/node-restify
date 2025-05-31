'use strict';

var assert = require('assert-plus');

/**
 * Collects route metadata from a restify server and exposes an endpoint
 * that serves an OpenAPI specification document. The spec is generated
 * on demand from the server's registered routes.
 *
 * @public
 * @function openapi
 * @param {Object} opts - plugin options
 * @param {Server} opts.server - restify server instance
 * @param {String} [opts.path='/openapi.json'] - path of the spec endpoint
 * @param {String} [opts.version='1.0.0'] - API version
 * @param {Object} [opts.info] - additional info object for the spec
 * @param {Object} [opts.servers] - array of server objects for the spec
 * @param {Object} [opts.schemas] - components.schemas definitions
 * @returns {Function} restify middleware
 *
 * @example
 * // create server and expose the spec under /spec
 * server.use(restify.plugins.openapi({
 *     server: server,
 *     path: '/spec',
 *     version: '1.2.3',
 *     info: { title: 'my api' }
 * }));
 */
function openapi(opts) {
    assert.object(opts, 'opts');
    assert.object(opts.server, 'opts.server');
    assert.optionalString(opts.path, 'opts.path');
    assert.optionalString(opts.version, 'opts.version');
    assert.optionalObject(opts.info, 'opts.info');
    assert.optionalArray(opts.servers, 'opts.servers');
    assert.optionalObject(opts.schemas, 'opts.schemas');

    var server = opts.server;
    var specPath = opts.path || '/openapi.json';
    var apiVersion = opts.version || '1.0.0';
    var info = opts.info || {};
    var serverList = opts.servers || [{ url: server.url || '' }];
    var schemas = opts.schemas || {};

    function buildSpec() {
        var routes = server.router.getRoutes();
        var paths = {};
        Object.keys(routes).forEach(function buildPath(name) {
            var r = routes[name];
            var method = r.method.toLowerCase();
            if (!paths[r.path]) {
                paths[r.path] = {};
            }
            paths[r.path][method] = {
                operationId: name,
                responses: {
                    200: {
                        description: 'Successful response'
                    }
                }
            };
        });
        return {
            openapi: '3.0.0',
            info: Object.assign(
                { title: server.name, version: apiVersion },
                info
            ),
            servers: serverList,
            paths: paths,
            components: { schemas: schemas }
        };
    }

    server.get(specPath, function sendSpec(req, res, next) {
        res.send(buildSpec());
        return next();
    });

    return function _openapi(req, res, next) {
        return next();
    };
}

module.exports = openapi;
