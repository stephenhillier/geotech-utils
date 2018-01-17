# geotech-utils
[![Build Status](https://travis-ci.org/stephenhillier/geotech-utils.svg?branch=master)](https://travis-ci.org/stephenhillier/geotech-utils)

A library of utilities for geotechnical analysis and lab calculations written in JavaScript

## module: sieve.js
Contains helper classes for storing the results of a grain size analysis (or sieve) test.

## Background:
A grain size analysis is a common laboratory test used to help determine the engineering properties of soil and aggregate. A soil sample is mechanically sorted using a stack of sieves, and each sieve retains particles of a different size. The results indicate the percentage of gravels, sands, and fine particles (i.e. silt and clay) in the sample.

## Quick start:
```javascript
import { SieveTest } from 'sieve';

// create an array containing the sizes (in mm) of each sieve
const sizes = [25, 20, 14, 10, 5, 2.5, 1.25, 0.630, 0.315, 0.160, 0.08];

// define the soil sample to be tested
const sample = {
  name: 'Sample 1',
  wetMass: 2100,
  dryMass: 2000,
  washedMass: 1900
};

// pass in an object with the sizes and the sample to create a new SieveTest object
const test = new SieveTest({ sizes, sample });
```
An array of sieves is created:

![stack collection example](./Screenshot.png)

This simple data structure can be used with a modern web framework (like Vue.JS) to generate input fields/models and store data for a lab testing or sample database application. 

Each sieve object has a "retained" property, denoting the mass of soil retained (recorded during the test). Continuing from the example above:
```javascript
// record the retained value for the 16 mm sieve by passing a number into retained()
test.sieve(16).retained(155);

// get the retained value by calling it with no arguments
console.log(test.sieve(16).retained());
>>> 155
```

Finally, to calculate the results of the test:

`SieveTest.prototype.passing()` - returns an array of "percent passing" values (to be plotted).

## Additional prototype methods
Use the following prototype methods to modify your SieveTest instance:

`SieveTest.prototype.addSieve(size)` - adds a sieve of a given size

`SieveTest.prototype.removeSieve(size)` - removes the specified sieve

`SieveTest.prototype.sieve(size)` - returns the sieve object with the specified size

## FAQ

**I have forms that allow users to record masses, but my results aren't calculated properly.**

HTML forms return a string, even if `<input type="number">`. Numeric values need to be of type Number. Vue.JS can typecast input; use this syntax:

`<input v-model.number="sieve.mass" type="number">`

**I've plotted the sieve results, but my grain size distribution curve doesn't start at 100%.**

For the grain size distribution to start at 100%, you need to record a size that 100% of the soil sample passed through. In other words, you should have at least one sieve size (the largest size) where sieve.mass === 0.

## Development:
To install dev dependencies and run unit tests, clone this repository and run:
```bash
npm install
npm run test
```
