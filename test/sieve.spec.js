/* eslint-env mocha */
// import { SingleSieve, SieveStack } from '../sieve';

const assert = require('assert');
const { SingleSieve } = require('../sieve').SingleSieve;
const { SieveStack } = require('../sieve').SieveStack;

describe('SingleSieve', () => {
  it('should create a sieve object with a given size', () => {
    const sieve = new SingleSieve(20);
    assert.equal(sieve, 20);
  });
});

describe('SieveStack', () => {
  it('should create a collection of SingleSieve objects if given an array', () => {
    const testSizes = [20, 10, 2.5, 0.63, 0.08];
    const stack = new SieveStack(testSizes);
    assert.equal(stack[0].size, 20);
  });
});
