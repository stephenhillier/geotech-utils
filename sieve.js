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
 *      const test = new SieveTest({ sizes, sample, units });
 *      where:
 *       - "sizes" is an array containing numerical size of each sieve.
 *       - "sample" is an object containing data about the soil sample (class coming soon)
 *       - "units" is an optional type of unit e.g. metric or imperial. Defaults to metric.
 */

export class SingleSieve {
  constructor(size, units = 'metric') {
    if ((size && typeof size === 'number' && !Number.isNaN(size)) || (size === 'Pan')) {
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
    } else {
      throw new Error('SingleSieve constructor was called without a valid size');
    }
  }

  // returns the mass retained on this sieve
  // if given a number as input, also sets the mass retained (for now, it is still returned)
  retained(mass) {
    if (mass && typeof mass === 'number' && !Number.isNaN(mass)) {
      this.mass = mass;
    }
    return this.mass;
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
    this.sampleData = sample || {
      wetMass: 0,
      dryMass: 0,
      washedMass: 0,
    };

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
      // this.index did not find sieve
      throw new Error(`Sieve with size ${size} not found`);
    }
  }

  // returns the SingleSieve object of the specified size
  sieve(size) {
    return this.stack.find(sieve => sieve.size === size);
  }

  passing() {
    /**
     * SieveTest.prototype.passing()
     *
     * Generally, the percent of soil "passing" (passing through) each sieve is plotted.
     *
     * To calculate this, iterate through the sieves (starting at the top) and keep track of
     * the cumulative total mass down to that point in the stack. The percent passing at any
     * point is the total mass of the sample minus the mass retained on the sieves so far
     * (i.e. at and above that point).
     */

    // get the sieve array and the sample dryMass from the instance
    const { stack } = this;
    const { dryMass } = this.sampleData;

    // make sure dryMass has been inputted and that sieves exist in the sieve array
    if (dryMass && stack.length) {
      const result = [];
      let cumulativeMass = 0;

      for (let i = 0; i < stack.length; i += 1) {
        const sieve = stack[i];

        // this calculates how much soil passed through the sieve:
        const passing = dryMass - sieve.mass - cumulativeMass;
        // and how much soil has been retained by sieves so far (including current sieve):
        cumulativeMass += sieve.mass;

        // Push the results from all the sieves (do not include the pan) into the result array.
        if (sieve.size !== 'Pan') {
          result.push({
            size: sieve.size,
            mass: sieve.mass,
            percentPassing: ((passing / dryMass) * 100).toFixed(1),
          });
        }
      }
      return result;
    }
    throw new Error('SieveTest.prototype.passing() requires both dryMass and sieve properties to be present');
  }
}
