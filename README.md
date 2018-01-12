# geotech-utils
A library of utilities for geotechnical analysis and lab calculations written in JavaScript

## module: sieve.js
Contains helper classes for storing the results of a grain size analysis (or sieve) test.

#### Background:
A grain size analysis is a common laboratory test used to help determine the engineering properties of soil and aggregate. A soil sample is mechanically sorted using a stack of sieves, and each sieve retains particles of a different size. The results indicate the percentage of gravels, sands, and fine particles (i.e. silt and clay) in the sample.

#### Usage:
```javascript
import { SieveTest } from 'sieve';

// create an array containing the sizes (in mm) of each sieve
const sizes = [25, 20, 14, 10, 5, 2.5, 1.25, 0.630, 0.315, 0.160, 0.08];

// pass in the sizes array (using an object) to create a new SieveTest object
const test = new SieveTest({ sizes });
```
**Result:**

![stack collection example](./Screenshot.png)

This simple data structure can be used with a modern web framework (like Vue.JS) to generate input fields/models and store data for a lab testing or sample database application. 

#### Prototype methods
Use the following prototype methods to modify your SieveTest instance:

`SieveTest.prototype.addSieve(size)` - adds a sieve of a given size

`SieveTest.prototype.removeSieve(size)` - removes the specified sieve

`SieveTest.prototype.index(size)` - returns the index of the specified sieve


**Work in progress!** Roadmap:
* `SieveTest.prototype.passing()` - calculates percent passing for each sieve in the stack and returns the results as an array

#### Development:
To install dev dependencies and run unit tests, clone this repository and run:
```bash
npm install
npm run test
```
