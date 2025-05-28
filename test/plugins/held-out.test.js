'use strict';
/* eslint-disable func-names */

const { expect } = require('chai');
const fs = require('fs');
const path = require('path');

describe('suite1', function() {
    it('leaky.js should exist', function() {
        const leakyTestPath = path.resolve(
            __dirname,
            '../../lib/plugins/leaky.js'
        );
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(leakyTestPath)).to.be.true;
    });
});

/*
describe('suite2', function() {
    it('expect brotliResponse to be a function', function() {
        const brotliResponse = require('../../lib/plugins/brotli.js');
        expect(brotliResponse).to.be.a('function');
    });
});

describe('suite3', function() {
    it('brotli.test.js should exist', function() {
        const brotliTestPath = path.resolve(
            __dirname,
            '../../test/plugins/brotli.test.js'
        );
        // eslint-disable-next-line no-unused-expressions
        expect(fs.existsSync(brotliTestPath)).to.be.true;
    });
});

describe('suite4', function() {
    // eslint-disable-next-line max-len
    it('should contain "zlib.createBrotliCompress" in the source code', function() {
        const brotliPath = path.resolve(
            __dirname,
            '../../lib/plugins/brotli.js'
        );
        const source = fs.readFileSync(brotliPath, 'utf8');
        expect(source).to.include('zlib.createBrotliCompress');
    });
});

describe('suite5', function() {
    // eslint-disable-next-line max-len
    it("should contain \"res.setHeader('Content-Encoding', 'br');\" in the source code", function() {
        const brotliPath = path.resolve(
            __dirname,
            '../../lib/plugins/brotli.js'
        );
        const source = fs.readFileSync(brotliPath, 'utf8');
        expect(source).to.include("res.setHeader('Content-Encoding', 'br');");
    });
});
*/
