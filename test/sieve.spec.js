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

  describe('SieveTest.prototype.index()', () => {
    it('should return the correct index of a given sieve size', () => {
      const sizes = [20, 16, 12, 0.08];
      const test = new SieveTest({ sizes });
      const position1 = test.index(20);
      const position2 = test.index(12);
      const position3 = test.index(0.08);
      assert.equal(test.stack[position1].size, 20);
      assert.equal(test.stack[position2].size, 12);
      assert.equal(test.stack[position3].size, 0.08);
    });
    it('should throw an error if sieve stack was deleted', () => {
      const test = new SieveTest();
      test.stack = []; // reset stack
      assert.throws(() => { test.index(20); }, Error);
    });
  });

  describe('SieveTest.prototype.add()', () => {
    it('should add a sieve to the stack', () => {
      const sizes = [20, 16, 12, 5, 0.08];
      const test = new SieveTest({ sizes });
      test.add(2.5);
      // add + 2 to sizes.length because all new SieveTest objects gain a "pan" object too
      assert.equal(test.stack.length, sizes.length + 2);
    });
    it('should add the sieve to the right place in the stack', () => {
      const sizes = [20, 12];
      const test = new SieveTest({ sizes });
      test.add(16);
      test.add(0.08);
      assert.equal(test.stack[0].size, 20);
      assert.equal(test.stack[1].size, 16, '16 mm sieve not placed between 20 mm and 12 mm');
      assert.equal(test.stack[3].size, 0.08, '0.08 mm sieve not placed before pan');
    });
  });
});
