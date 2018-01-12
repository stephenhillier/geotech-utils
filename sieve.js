/**
 * sieve.js
 *
 * Utilities for storing grain size analysis (sieve) test data and calculating results
 *
 * class SingleSieve:
 * - creates sieve objects that have properties size (of screen) and mass (of soil retained)
 * - intended to be used by a SieveTest instance to populate the "stack" with "sieve" objects
 *
 * class SieveTest:
 * - creates a "stack" of sieves and populates it with sieve objects from class SingleSieve
 * - a "Pan" sieve is always created
 * - usage:
 *      const stack = new SieveTest({ sizes, sample, units });
 *      where:
 *       - "sizes" is an array containing numerical size of each sieve.
 *       - "sample" is an object containing data about the soil sample (class coming soon)
 *       - "units" is an optional type of unit e.g. metric or imperial. Defaults to metric.
 *       - limited support for imperial sizes or # sizes (e.g. #200, #100 sizes...)
 */

export class SingleSieve {
  constructor(size, units = 'metric') {
    this.size = size;
    this.mass = 0;

    // Add units for numerical size/mass values
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

export class SieveTest {
  constructor(params = {}) {
    /** Creates the SieveTest object. Accepts an object as an argument:
     *
     * {
     *   sizes: an array containing the sieve sizes for this test
     *   sample: an object containing sample information
     *   units: a string declaring the units - 'metric' (default) or 'imperial'
     * }
     *
     */

    // unpack arguments
    const { sizes, units, sample } = params;

    // set the sample data object for this test, or if not provided, start with empty object
    this.sample = sample || {};

    // create the sieve "stack"
    const constructorStack = []; // array declared as const but new values will be pushed

    if (Array.isArray(sizes)) {
      // iterate through array of sieve sizes and add a SingleSieve object for each size
      sizes.forEach((item) => {
        // skip invalid non numeric input
        if (typeof item === 'number' && !Number.isNaN(item)) {
          const newSieve = new SingleSieve(item, units);
          constructorStack.push(newSieve);
        }
      });
    }

    // ensure array is sorted (by size) if it was entered out of order
    constructorStack.sort((a, b) => b.size - a.size);

    // Add a default 'Pan' sieve to every stack
    constructorStack.push(new SingleSieve('Pan', units));

    // finally, set the object's "stack" property to the array of sieve objects
    // note: may be better to copy this array (like with splice()).
    this.stack = constructorStack;
  }

  index(size) {
    if (this.stack.length) {
      return this.stack.findIndex(sieve => sieve.size === size);
    }
    // Array can't be found
    throw new Error('There are no sieves in the SieveTest stack array. Add some sieves to the test');
  }

  addSieve(size) {
    const newSieve = new SingleSieve(size);

    // find the right position for the new sieve in the sorted sieve stack
    const position = this.stack.findIndex(sieve => (sieve.size === 'Pan' || newSieve.size > sieve.size));

    // insert new sieve object into stack
    this.stack.splice(position, 0, newSieve);
  }

  removeSieve(size) {
    // this.index returns -1 if sieve is not found
    if (this.index(size) !== -1) {
      // use splice to delete the specified sieve
      this.stack.splice(this.index(size), 1);
    } else {
      // this.index did not find sieve and returned -1
      throw new Error(`Sieve with size ${size} not found`);
    }
  }
}
