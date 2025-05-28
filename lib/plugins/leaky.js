/* eslint-disable func-names */
'use strict';

/**
 * Leaky Bucket Throttling Plugin for Restify
 * Usage:
 *   const leaky = require('./lib/plugins/leaky');
 *   server.use(leaky({ capacity: 10, leakRate: 1, interval: 1000 }));
 */

const buckets = new Map();

/**
 * Leaky bucket throttling options.
 * @param {Object} options - Configuration options for the leaky bucket throttling middleware.
 * @param {number} options.capacity - Max requests in the bucket.
 * @param {number} options.leakRate - Number of requests to leak per interval.
 * @param {number} options.interval - Leak interval in ms.
 * @returns {Function} Restify middleware function for rate limiting.
 */

function leaky(options = {}) {
    const {
        capacity = 10,
        leakRate = 1,
        interval = 1000,
        key = req => req.connection.remoteAddress // Throttle per IP by default
    } = options;

    setInterval(() => {
        for (const bucket of buckets.values()) {
            bucket.count = Math.max(0, bucket.count - leakRate);
        }
    }, interval);

    // eslint-disable-next-line consistent-return
    return function(req, res, next) {
        const id = key(req);
        if (!buckets.has(id)) {
            buckets.set(id, { count: 0 });
        }
        const bucket = buckets.get(id);

        if (bucket.count < capacity) {
            bucket.count += 1;
            return next();
        } else {
            res.status(429);
            res.send({ error: 'Too Many Requests' });
        }
    };
}

module.exports = leaky;
