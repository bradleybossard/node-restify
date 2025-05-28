/* eslint-disable no-unused-expressions */
/* eslint-disable func-names */
'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const leaky = require('../../lib/plugins/leaky');

// javascript

describe('leaky bucket middleware', function() {
    let clock;
    let req, res, next;

    beforeEach(function() {
        clock = sinon.useFakeTimers();
        req = { connection: { remoteAddress: '1.2.3.4' } };
        res = {
            status: sinon.stub(),
            send: sinon.stub()
        };
        next = sinon.stub();
    });

    afterEach(function() {
        clock.restore();
    });

    it('should allow requests under capacity', function() {
        const middleware = leaky({ capacity: 2, leakRate: 1, interval: 1000 });
        middleware(req, res, next);
        middleware(req, res, next);
        expect(next.callCount).to.equal(2);
        expect(res.status.called).to.be.false;
    });

    it('should block requests over capacity', function() {
        const middleware = leaky({ capacity: 1, leakRate: 1, interval: 1000 });
        middleware(req, res, next); // allowed
        middleware(req, res, next); // blocked
        expect(next.callCount).to.equal(1);
        expect(res.status.calledWith(429)).to.be.true;
        expect(res.send.calledWith({ error: 'Too Many Requests' })).to.be.true;
    });

    it('should leak requests after interval', function() {
        const middleware = leaky({ capacity: 1, leakRate: 1, interval: 1000 });
        middleware(req, res, next); // allowed
        middleware(req, res, next); // blocked
        expect(next.callCount).to.equal(1);

        // Advance time to leak one request
        clock.tick(1000);

        middleware(req, res, next); // should be allowed again
        expect(next.callCount).to.equal(2);
    });

    it('should use custom key function', function() {
        const customReq1 = { user: { id: 'user1' } };
        const customReq2 = { user: { id: 'user2' } };
        const middleware = leaky({
            capacity: 1,
            leakRate: 1,
            interval: 1000,
            key: request => request.user.id
        });

        middleware(customReq1, res, next); // allowed
        middleware(customReq1, res, next); // blocked
        middleware(customReq2, res, next); // allowed (different key)

        expect(next.callCount).to.equal(2);
        expect(res.status.calledWith(429)).to.be.true;
    });
});
