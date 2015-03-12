"use strict";

import config from "./config";
import * as util from "./util";

/// # sc.at(array, index)
/// return the item at the index
/// ### Example
/// ```js
/// sc.at([ 1, 2, 3, 4 ], 2); // => 3
/// ```
export function at(array, index) {
  return array[index|0];
}

/// # sc.choose(array, randomAPI=sc.config.randomAPI)
/// Choose an element from the collection at random.
export function choose(array, randomAPI) {
  let rand = util.defaults(randomAPI, config.randomAPI);
  return array[(rand() * array.length)|0];
}

/// # sc.clipAt(array, index)
/// same as `at`, but values for index greater than the size of the Array will be clipped to the last index
/// ### Example
/// ```js
/// sc.clipAt([ 1, 2, 3, 4 ], 10); // => 4
/// ```
export function clipAt(array, index) {
  return array[Math.max(0, Math.min(index|0, array.length - 1))];
}

/// # sc.clipExtend(array, length)
/// Same as `wrapExtend` but the sequences "clip" (return their last element) rather than wrapping.
/// ### Example
/// ```js
/// sc.clipExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 4, 4, 4, 4, 4, 4 ]
/// ```
export function clipExtend(array, length) {
  length = Math.max(0, length|0);

  let result = new Array(length);

  for (let i = 0; i< length; ++i) {
    result[i] = clipAt(array, i);
  }

  return result;
}

/// # sc.foldAt(array, index)
/// same as `at`, but values for *index* greater than the size of the Array will be folded back
/// ### Example
/// ```js
/// sc.foldAt([ 1, 2, 3, 4 ], 10); // => 3
/// ```
export function foldAt(array, index) {
  index = index|0;

  let len1 = array.length;
  let len2 = len1 * 2 - 2;

  while (!(0 <= index && index < len1)) {
    if (index < 0) {
      index += len2;
    }
    if (len1 <= index) {
      index = len2 - index;
    }
  }

  return array[index];
}

/// # sc.foldExtend(array, length)
/// Same as `wrapExtend` but the sequences fold back on the list elements.
/// ### Example
/// ```js
/// sc.foldExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 3, 2, 1, 2, 3, 4 ]
/// ```
export function foldExpand(array, length) {
  length = Math.max(0, length|0);

  let result = new Array(length);

  for (let i = 0; i< length; ++i) {
    result[i] = foldAt(array, i);
  }

  return result;
}

/// # sc.indexOf(array, searchElement, fromIndex=0)
/// Return the first index at which given element can be found in the array.
/// ### Example
/// ```js
/// sc.indexOf([ 1, 2, 3, 4 ], 2); // => 1
/// ```
export function indexOf(array, searchElement, fromIndex) {
  fromIndex = util.default(fromIndex, 0);
  return array.indexOf(searchElement, fromIndex);
}

/// # sc.lastIndexOf(array, searchElement, fromIndex=array.length)
/// Return the last index at which given element can be found in the array.
/// ### Example
/// ```js
/// sc.indexOf([ 1, 2, 3, 4 ], 2); // => 1
/// ```
export function lastIndexOf(array, searchElement, fromIndex) {
  fromIndex = util.default(fromIndex, array.length);
  return array.lastIndexOf(searchElement, fromIndex);
}

/// # sc.mirror(array)
/// Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
/// ## Example
/// ```js
/// sc.mirror([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 3, 2, 1 ]
/// ```
export function mirror(array) {
  let length = array.length * 2 - 1;
  let result = new Array(length);

  for (let i = 0, imax = array.length; i < imax; ++i) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = imax - 2; i < imax; ++i, --j) {
    result[i] = array[j];
  }

  return result;
}

/// # sc.mirror1(array)
/// Return a new Array which is the receiver made into a palindrome with the last element removed. This is useful if the list will be repeated cyclically, the first element will not get played twice. The receiver is unchanged.
/// ## Example
/// ```js
/// sc.mirror1([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 3, 2 ]
/// ```
export function mirror1(array) {
  let length = array.length * 2 - 2;
  let result = new Array(length);

  for (let i = 0, imax = array.length; i < imax; ++i) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = imax - 2; i < imax; ++i, --j) {
    result[i] = array[j];
  }

  return result;
}

/// # sc.mirror2(array)
/// Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
/// ## Example
/// ```js
/// sc.mirror2([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 4, 3, 2, 1 ]
/// ```
export function mirror2(array) {
  let length = array.length * 2;
  let result = new Array(length);

  for (let i = 0, imax = array.length; i < imax; ++i) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = imax - 1; i < imax; ++i, --j) {
    result[i] = array[j];
  }

  return result;
}

/// # sc.normalize(array, min=0, max=1)
/// Return a new Array with the receiver items normalized between **min** and **max**.
/// ## Example
/// ```js
/// [ 1, 2, 3 ].normalize(-20, 10); // => [ -20, -5, 10 ]
/// ```
export function normalize(array, min, max) {
  let outMin = util.defaults(min, 0);
  let outMax = util.defaults(max, 1);
  let inMax = -Infinity;
  let inMin = +Infinity;
  let result = new Array(array.length);

  for (let i = 0, imax = array.length; i < imax; i++) {
    inMax = Math.max(inMax, array[i]);
    inMin = Math.min(inMin, array[i]);
  }

  let inRange = inMax - inMin;
  let outRange = outMax - outMin;

  for (let i = 0, imax = array.length; i < imax; i++) {
    result[i] = (array[i] - inMin) / inRange * outRange + outMin;
  }

  return result;
}

/// # sc.scramble(array, randomAPI=sc.config.randomAPI)
/// Returns a new Array whose elements have been scrambled. The receiver is unchanged.
/// ## Example
/// ```js
/// sc.config.randomAPI = new sc.Random(10000).random;
///
/// sc.scramble([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]); // => [ 1, 6, 3, 9, 8, 0, 7, 2, 5, 4 ]
/// ```
export function scramble(array, randomAPI) {
  let rand = util.defaults(randomAPI, config.randomAPI);
  let result = Array.prototype.slice.call(array);
  let k = result.length;

  for (let i = 0, imax = result.length - 1; i < imax; i++) {
    let j = i + ((rand() * k--)|0);
    [ result[i], result[j] ] = [ result[j], result[i] ];
  }

  return result;
}

/// # sc.wrapAt(array, index)
/// same as `at`, but values for index greater than the size of the Array will be wrapped around to 0
/// ### Example
/// ```js
/// sc.wrapAt([ 1, 2, 3, 4 ], 10); // => 3
/// ```
export function wrapAt(array, index) {
  index = (index|0) % array.length;
  if (index < 0) {
    index += array.length;
  }
  return array[index];
}

/// # sc.wrapExtend(array, length)
/// Returns a new Array whose elements are repeated sequences of the receiver, up to size length.
/// ### Example
/// ```js
/// sc.wrapExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 1, 2, 3, 4, 1, 2 ]
/// ```
export function wrapExpand(array, length) {
  length = Math.max(0, length|0);

  let result = new Array(length);

  for (let i = 0; i< length; ++i) {
    result[i] = wrapAt(array, i);
  }

  return result;
}

/// # sc.blendAt(array, index, method="clipAt")
/// return a linearly interpolated value between the two closest indices
export function blendAt(array, index, method) {
  let at = { clipAt, wrapAt, foldAt }[method] || clipAt;
  let x0 = at(array, (index|0));
  let x1 = at(array, (index|0) + 1);
  return x0 + Math.abs(index - (index|0)) * (x1 - x0);
}
