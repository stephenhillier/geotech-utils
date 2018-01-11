/**
 * sieve.js
 *
 * Utilities for storing grain size analysis (sieve) test data and calculating results
 *
 * class SingleSieve:
 * - creates sieve objects that have properties size (of screen) and mass (of soil retained)
 * - intended to be used by a SieveStack instance to populate the "stack" with "sieve" objects
 *
 * class SieveStack:
 * - creates a "stack" of sieves and populates it with sieve objects from class SingleSieve
 * - a "Pan" sieve is always created
 * - usage:
 *      const stack = new SieveStack(sizes, units);
 *      where:
 *       - "sizes" is an array containing numerical size of each sieve.
 *       - "units" is an optional type of unit e.g. metric or imperial. Defaults to metric.
 *       - limited support for imperial sizes or # sizes (e.g. #200, #100 sizes...)
 */

export class SingleSieve {
  constructor(size, mass = 0, units = 'metric') {
    this.size = size;
    this.mass = mass;
    switch (units) {
      case 'imperial': {
        this.sizeUnit = 'in';
        this.massUnit = 'lb';
        break;
      }
      case 'metric': // let metric fall through to default
      default: {
        // default to metric units
        this.sizeUnit = 'mm';
        this.massUnit = 'g';
      }
    }
  }
}

export default class SieveStack {
  constructor(sizeArray, units) {
    const constructorStack = []; // array declared as const but new values can be pushed
    if (Array.isArray(sizeArray)) {
      sizeArray.forEach((item) => {
        if (typeof item === 'number' && !Number.isNaN(item)) {
          const newSieve = new SingleSieve(item, units);
          constructorStack.push(newSieve);
        }
      });
    }
    constructorStack.push(new SingleSieve('Pan', units));
    this.stack = constructorStack;
  }
}
