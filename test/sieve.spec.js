/* eslint-env mocha */
import { Sieve, SieveTest } from '../sieve';

const assert = require('assert');

describe('Sieve', () => {
  it('should create a sieve object with a given size (try 20)', () => {
    const sieve = new Sieve(20);
    assert.equal(sieve.size, 20);
  });
  it('should create a pan object when called with string "Pan"', () => {
    const sieve = new Sieve('Pan');
    assert.equal(sieve.size, 'Pan');
  });
  it('should throw an error if not called with a number, except for special string case "Pan"', () => {
    assert.throws(() => {
      const sieve = new Sieve('NotPan');
      sieve.retained();
    }, Error, 'Did not throw an error when Sieve was called with an invalid string');
  });
  it('should create a sieve with imperial sizes if given arg "imperial"', () => {
    const sieve = new Sieve(0.75, 'imperial');
    assert.equal(sieve.sizeUnit, 'in');
    assert.equal(sieve.massUnit, 'lb');
  });

  describe('Sieve.prototype.retained()', () => {
    it('should set this.mass if given a number as input', () => {
      const sieve = new Sieve(20);
      sieve.retained(150);
      assert.equal(sieve.mass, 150);
    });
    it('should return this.mass if not given an input', () => {
      const sieve = new Sieve(20);
      sieve.retained(150);
      assert.equal(sieve.retained(), 150);
    });
  });
});

describe('SieveTest', () => {
  it('should create a collection of Sieve objects if given an array', () => {
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

  describe('SieveTest.prototype.addSieve()', () => {
    it('should add a sieve to the stack', () => {
      const sizes = [20, 16, 12, 5, 0.08];
      const test = new SieveTest({ sizes });
      test.addSieve(2.5);
      // add + 2 to sizes.length because all new SieveTest objects gain a "pan" object too
      assert.equal(test.stack.length, sizes.length + 2);
    });
    it('should add the sieve to the right place in the stack', () => {
      const sizes = [20, 12];
      const test = new SieveTest({ sizes });
      test.addSieve(16);
      test.addSieve(0.08);
      assert.equal(test.stack[0].size, 20);
      assert.equal(test.stack[1].size, 16, '16 mm sieve not placed between 20 mm and 12 mm');
      assert.equal(test.stack[3].size, 0.08, '0.08 mm sieve not placed before pan');
    });
  });

  describe('SieveTest.prototype.removeSieve()', () => {
    it('should remove the specified sieve and replace it with the next smallest', () => {
      const sizes = [20, 16, 12, 5];
      const test = new SieveTest({ sizes });
      test.removeSieve(16);
      assert.equal(test.stack[0].size, 20);
      assert.equal(test.stack[1].size, 12);
      assert.equal(test.stack.length, sizes.length);
    });
    it('should throw an error if an invalid size is given', () => {
      const sizes = [20, 16, 12, 5];
      const test = new SieveTest({ sizes });
      assert.throws(() => { test.removeSieve(2.5); }, Error, 'Error not thrown');
    });
  });

  describe('SieveTest.prototype.sieve()', () => {
    it('should return the specified Sieve object', () => {
      const sizes = [20, 16, 12, 5];
      const test = new SieveTest({ sizes });
      assert.equal(test.sieve(16) instanceof Sieve, true, 'did not return a Sieve object');
      assert.equal(test.sieve(16).size, 16, 'did not return the correct size');
    });
  });

  describe('SieveTest.prototype.passing()', () => {
    it('should calculate the percent passing for a given sample and set of sieves', () => {
      const sizes = [16, 12, 5, 2];
      // define the sample
      const sample = {
        wetMass: 2100,
        dryMass: 2000,
        washedMass: 1900,
      };
      const test = new SieveTest({ sizes, sample });

      // put 100g in every sieve
      test.stack.forEach((sieve) => { sieve.retained(100); });

      // add an empty sieve at top of stack (have one sieve with 100% passing)
      test.addSieve(20);

      // manually set some variables to keep assert calls tidier
      // e.g. set passing20 to the 20 mm sieve object in the passing() array
      const passing20 = test.passing().find(sieve => sieve.size === 20);
      const passing16 = test.passing().find(sieve => sieve.size === 16);
      const passing12 = test.passing().find(sieve => sieve.size === 12);
      const passing5 = test.passing().find(sieve => sieve.size === 5);
      const passing2 = test.passing().find(sieve => sieve.size === 2);

      assert.equal(passing20.percentPassing, 100.0, 'Incorrect percent passing on 20 mm sieve');
      assert.equal(passing16.percentPassing, 95.0, 'Incorrect percent passing on 16 mm sieve');
      assert.equal(passing12.percentPassing, 90.0, 'Incorrect percent passing on 12 mm sieve');
      assert.equal(passing5.percentPassing, 85.0, 'Incorrect percent passing on 5 mm sieve');
      assert.equal(passing2.percentPassing, 80.0, 'Incorrect percent passing on 2 mm sieve');
    });
    it('should throw an error if calling passing() without sample data or a set of sieves', () => {
      const sizes = [16, 12, 5, 2];
      const test = new SieveTest({ sizes });
      assert.throws(() => { test.passing(); }, Error, 'Did not throw an error');
    });
  });
});
