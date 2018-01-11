/* eslint-env mocha */
import { SingleSieve, SieveStack } from '../sieve';

const assert = require('assert');

describe('SingleSieve', () => {
  it('should create a sieve object with a given size (try 20)', () => {
    const sieve = new SingleSieve(20);
    assert.equal(sieve.size, 20);
  });
  it('should create a pan object when called with string \"Pan\"', () => {
    const sieve = new SingleSieve('Pan');
    assert.equal(sieve.size, 'Pan');
  });
});

describe('SieveStack', () => {
  it('should create a collection of SingleSieve objects if given an array', () => {
    const testSizes = [20, 10, 0.08];
    const stack = new SieveStack(testSizes);
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 10);
    assert.equal(stack.stack[2].size, 0.08);
  });
  it('should automatically add a pan to the bottom of the stack if not given one', () => {
    const testSizes = [20, 10, 0.08];
    const stack = new SieveStack(testSizes);
    assert.equal(stack.stack[stack.stack.length - 1].size, 'Pan');
  });
  it('should sort out of order inputs', () => {
    const testSizes = [10, 0.08, 20];
    const stack = new SieveStack(testSizes);
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 10);
    assert.equal(stack.stack[2].size, 0.08);
  });
  it('should never allow more than one pan', () => {
    const testSizes = ['Pan', 'Pan', 20, 'Pan'];
    const stack = new SieveStack(testSizes);
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 'Pan');
    assert.equal(stack.stack.length, 2);
  });
  it('should discard strings in the array passed to the constructor', () => {
    const testSizes = ['asdf', 20, 'one', 10];
    const stack = new SieveStack(testSizes);
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 10);
    assert.equal(stack.stack[2].size, 'Pan');
    assert.equal(stack.stack.length, 3);
  });
});
