# geotech-utils
A library of utilities for geotechnical analysis and lab calculations written in JavaScript

## module: sieve.js
Contains helper classes for storing the results of a grain size analysis (or sieve) test.

#### Usage:
```javascript
import { SieveStack } from 'sieve';

// create an array containing the sizes (in mm) of each sieve
const sizes = [25, 20, 14, 10, 5, 2.5, 1.25, 0.630, 0.315, 0.160, 0.08];

// pass the array into the constructor to create a new SieveStack object
const stack = new SieveStack(sizes);
```
**Result:**

![stack collection example](./Screenshot.png)

**Work in progress!** Roadmap:
* `SieveStack.prototype.passing()` - calculates percent passing for each sieve in stack and returns an array
