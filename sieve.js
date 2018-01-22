/**
 * sieve.js
 *
 * Utilities for storing grain size analysis (sieve) test data and calculating results
 *
 * class Sieve:
 * - creates sieve objects that have properties size (of screen) and mass (of soil retained)
 * - intended to be used by a SieveTest instance to populate the "stack" with "sieve" objects
 *
 * class SieveTest:
 * - creates a "stack" of sieves and populates it with sieve objects from class Sieve
 * - a "Pan" sieve is always created
 * - usage:
 *      const test = new SieveTest({ sizes, sample, units });
 *      where:
 *       - "sizes" is an array containing numerical size of each sieve.
 *       - "sample" is an object containing data about the soil sample (class coming soon)
 *       - "units" is an optional type of unit e.g. metric or imperial. Defaults to metric.
 */

export class Sieve {
  constructor(size, units = 'metric') {
    // check that the given size is a positive number. One exception: allow a special case 'Pan'
    if ((typeof size === 'number' && !Number.isNaN(size) && size > 0) || (size === 'Pan')) {
      this.size = size;
    } else {
      throw new Error('Sieve constructor was called without a valid size');
    }

    this.mass = 0;

    // Add units for numerical size/mass values.
    if (units === 'imperial') {
      this.sizeUnit = 'in';
      this.massUnit = 'lb';
    } else {
      this.sizeUnit = 'mm';
      this.massUnit = 'g';
    }
  }

  retained(mass) {
    /**
     * Returns the mass retained on this sieve
     * if given a number as input, also sets the mass retained (for now, it is still returned)
     */
    if (typeof mass === 'number' && !Number.isNaN(mass)) {
      this.mass = mass;
    }
    return this.mass;
  }
}

export class SieveTest {
  constructor(params = {}) {
    /** Creates the SieveTest object. Accepts an object with the following properties:
     *
     *  sizes: an array containing the sieve sizes for this test
     *  sample: an object containing sample information
     *  units: a string declaring the units - 'metric' (default) or 'imperial'
     *
     */

    const { sizes, units, sample } = params;

    // start with some default values if a sample object was not provided
    this.sampleData = sample || {
      wetMass: 0,
      dryMass: 0,
      washedMass: 0,
    };

    const constructorStack = [];

    if (Array.isArray(sizes)) {
      // iterate through array of sieve sizes and add a Sieve object for each size
      sizes.forEach((item) => {
        // skip invalid non numeric input
        if (typeof item === 'number' && !Number.isNaN(item)) {
          const newSieve = new Sieve(item, units);
          constructorStack.push(newSieve);
        }
      });
    }

    constructorStack.sort((a, b) => b.size - a.size);

    // Add a default 'Pan' sieve to every stack
    constructorStack.push(new Sieve('Pan', units));

    this.stack = constructorStack;
  }

  index(size) {
    /**
     * Returns the position of the sieve of the given size in the sieve array (type Number)
     */
    if (this.stack.length) {
      return this.stack.findIndex(sieve => sieve.size === size);
    }
    // Array can't be found
    throw new Error('There are no sieves in the SieveTest stack array. Add some sieves to the test');
  }

  addSieve(size) {
    /**
     * Adds a sieve of the given size into the correct (sorted) position in the sieve array.
     * No return value.
     */
    const newSieve = new Sieve(size);

    // find the right position for the new sieve in the sorted sieve stack
    const position = this.stack.findIndex(sieve => (sieve.size === 'Pan' || newSieve.size > sieve.size));

    // insert new sieve object into stack
    this.stack.splice(position, 0, newSieve);
  }

  removeSieve(size) {
    /**
     * Removes the specified sieve from the sieve array
     */
    if (this.index(size) !== -1) {
      // use splice to delete the specified sieve
      this.stack.splice(this.index(size), 1);
    } else {
      throw new Error(`Sieve with size ${size} not found`);
    }
  }

  sieve(size) {
    /**
     * returns the Sieve object of the specified size
     */
    return this.stack.find(sieve => sieve.size === size);
  }

  passing() {
    /**
     * Computes the percent passing (the amount of soil that was able to pass through a sieve)
     * for each sieve in the sieve array.
     *
     * To calculate this, iterate through the sieves (starting at the top) and keep track of
     * the cumulative total mass down to that point in the stack. The percent passing at any
     * point is the total mass of the sample minus the cumulative mass retained.
     */

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
    throw new Error('passing() requires both dryMass and sieve properties to be present');
  }
}
