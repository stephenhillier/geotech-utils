/* eslint-env mocha */
import { SingleSieve, SieveTest } from '../sieve';

const assert = require('assert');

describe('SingleSieve', () => {
  it('should create a sieve object with a given size (try 20)', () => {
    const sieve = new SingleSieve(20);
    assert.equal(sieve.size, 20);
  });
  it('should create a pan object when called with string "Pan"', () => {
    const sieve = new SingleSieve('Pan');
    assert.equal(sieve.size, 'Pan');
  });
  it('should create a sieve with imperial sizes if given arg "imperial"', () => {
    const sieve = new SingleSieve('.75', 'imperial');
    assert.equal(sieve.sizeUnit, 'in');
    assert.equal(sieve.massUnit, 'lb');
  });
});

describe('SieveTest', () => {
  it('should create a collection of SingleSieve objects if given an array', () => {
    const sizes = [20, 10, 0.08];
    const stack = new SieveTest({ sizes });
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 10);
    assert.equal(stack.stack[2].size, 0.08);
  });
  it('should automatically add a pan to the bottom of the stack if not given one', () => {
    const sizes = [20, 10, 0.08];
    const stack = new SieveTest({ sizes });
    assert.equal(stack.stack[stack.stack.length - 1].size, 'Pan');
  });
  it('should sort out of order inputs', () => {
    const sizes = [10, 0.08, 20];
    const stack = new SieveTest({ sizes });
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 10);
    assert.equal(stack.stack[2].size, 0.08);
  });
  it('should never allow more than one pan', () => {
    const sizes = ['Pan', 'Pan', 20, 'Pan'];
    const stack = new SieveTest({ sizes });
    assert.equal(stack.stack[0].size, 20);
    assert.equal(stack.stack[1].size, 'Pan');
    assert.equal(stack.stack.length, 2);
  });
});
