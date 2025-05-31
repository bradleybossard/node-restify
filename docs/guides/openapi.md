# OpenAPI Plugin

Restify's OpenAPI plugin generates a simple OpenAPI 3 specification from the
routes registered on a server and exposes it via an HTTP endpoint.

## Usage

```js
const restify = require('restify');
const server = restify.createServer();

// register your routes
server.get('/foo', function (req, res, next) {
  res.send('foo');
  next();
});

// expose the spec under /openapi.json
server.use(
  restify.plugins.openapi({
    server: server,
    path: '/openapi.json',
    version: '1.0.0',
    info: { title: 'Example Service' }
  })
);

server.listen(8080);
```

Requesting `/openapi.json` will return a JSON representation of the generated
specification containing all registered routes. Each route will include a
default `200` response object to ensure the spec is valid.
