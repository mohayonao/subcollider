import config from "./config";
import * as utils from "./utils";

function newArray(array, length) {
  return new array.constructor(length);
}

//// # sc.at(array, index)
//// return the item at the index
//// ### Example
//// ```js
//// sc.at([ 1, 2, 3, 4 ], 2); // => 3
//// ```
export function at(array, index) {
  return array[index|0];
}

//// # sc.blendAt(array, index, method="clipAt")
//// return a linearly interpolated value between the two closest indices
export function blendAt(array, index, method) {
  let at = { clipAt, wrapAt, foldAt }[method] || clipAt;
  let x0 = at(array, index);
  let x1 = at(array, index + (index < 0 ? -1 : 1));

  return x0 + Math.abs(index - (index|0)) * (x1 - x0);
}

//// # sc.choose(array, randomAPI=sc.config.randomAPI)
//// Choose an element from the collection at random.
export function choose(array, rand) {
  rand = utils.defaults(rand, config.randomAPI);

  return array[(rand() * array.length)|0];
}

//// # sc.clipAt(array, index)
//// same as `at`, but values for index greater than the size of the Array will be clipped to the last index
//// ### Example
//// ```js
//// sc.clipAt([ 1, 2, 3, 4 ], 10); // => 4
//// ```
export function clipAt(array, index) {
  return array[Math.max(0, Math.min(index|0, array.length - 1))];
}

//// # sc.clipExtend(array, length)
//// Same as `wrapExtend` but the sequences "clip" (return their last element) rather than wrapping.
//// ### Example
//// ```js
//// sc.clipExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 4, 4, 4, 4, 4, 4 ]
//// ```
export function clipExtend(array, length) {
  length = Math.max(0, length|0);

  let result = newArray(array, length);

  for (let i = 0; i < length; i++) {
    result[i] = clipAt(array, i);
  }

  return result;
}

//// # sc.foldAt(array, index)
//// same as `at`, but values for *index* greater than the size of the Array will be folded back
//// ### Example
//// ```js
//// sc.foldAt([ 1, 2, 3, 4 ], 10); // => 3
//// ```
export function foldAt(array, index) {
  index |= 0;

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

//// # sc.foldExtend(array, length)
//// Same as `wrapExtend` but the sequences fold back on the list elements.
//// ### Example
//// ```js
//// sc.foldExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 3, 2, 1, 2, 3, 4 ]
//// ```
export function foldExtend(array, length) {
  length = Math.max(0, length|0);

  let result = newArray(array, length);

  for (let i = 0; i < length; i++) {
    result[i] = foldAt(array, i);
  }

  return result;
}

//// # sc.indexOf(array, searchElement, fromIndex=0)
//// Return the first index at which given element can be found in the array.
//// ### Example
//// ```js
//// sc.indexOf([ 1, 2, 3, 4 ], 2); // => 1
//// ```
export function indexOf(array, searchElement, fromIndex) {
  fromIndex = utils.defaults(fromIndex, 0)|0;

  if (typeof array.indexOf === "function") {
    return array.indexOf(searchElement, fromIndex);
  }

  if (fromIndex < 0) {
    fromIndex = Math.max(0, fromIndex + array.length);
  }

  for (let i = fromIndex, imax = array.length; i < imax; i++) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

//// # sc.lastIndexOf(array, searchElement, fromIndex=array.length)
//// Return the last index at which given element can be found in the array.
//// ### Example
//// ```js
//// sc.indexOf([ 1, 2, 3, 4 ], 2); // => 1
//// ```
export function lastIndexOf(array, searchElement, fromIndex) {
  fromIndex = utils.defaults(fromIndex, array.length)|0;

  if (typeof array.lastIndexOf === "function") {
    return array.lastIndexOf(searchElement, fromIndex);
  }

  if (fromIndex < 0) {
    fromIndex = Math.max(0, fromIndex + array.length);
  }

  for (let i = fromIndex; i >= 0; i--) {
    if (array[i] === searchElement) {
      return i;
    }
  }

  return -1;
}

//// # sc.mirror(array)
//// Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
//// ## Example
//// ```js
//// sc.mirror([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 3, 2, 1 ]
//// ```
export function mirror(array) {
  let length = array.length * 2 - 1;
  let result = newArray(array, length);

  for (let i = 0, imax = array.length; i < imax; i++) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = array.length - 2; i < imax; i++, j--) {
    result[i] = array[j];
  }

  return result;
}

//// # sc.mirror1(array)
//// Return a new Array which is the receiver made into a palindrome with the last element removed. This is useful if the list will be repeated cyclically, the first element will not get played twice. The receiver is unchanged.
//// ## Example
//// ```js
//// sc.mirror1([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 3, 2 ]
//// ```
export function mirror1(array) {
  let length = array.length * 2 - 2;
  let result = newArray(array, length);

  for (let i = 0, imax = array.length; i < imax; i++) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = array.length - 2; i < imax; i++, j--) {
    result[i] = array[j];
  }

  return result;
}

//// # sc.mirror2(array)
//// Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
//// ## Example
//// ```js
//// sc.mirror2([ 1, 2, 3, 4 ]); // => [ 1, 2, 3, 4, 4, 3, 2, 1 ]
//// ```
export function mirror2(array) {
  let length = array.length * 2;
  let result = newArray(array, length);

  for (let i = 0, imax = array.length; i < imax; i++) {
    result[i] = array[i];
  }

  for (let i = array.length, imax = length, j = array.length - 1; i < imax; i++, j--) {
    result[i] = array[j];
  }

  return result;
}

//// # sc.normalize(array, min=0, max=1)
//// Return a new Array with the receiver items normalized between **min** and **max**.
//// ## Example
//// ```js
//// [ 1, 2, 3 ].normalize(-20, 10); // => [ -20, -5, 10 ]
//// ```
export function normalize(array, min, max) {
  let outMin = utils.defaults(min, 0);
  let outMax = utils.defaults(max, 1);
  let inMax = -Infinity;
  let inMin = +Infinity;
  let result = newArray(array, array.length);

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

//// # sc.scramble(array, randomAPI=sc.config.randomAPI)
//// Returns a new Array whose elements have been scrambled. The receiver is unchanged.
//// ## Example
//// ```js
//// sc.config.randomAPI = new sc.Random(10000).random;
////
//// sc.scramble([ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]); // => [ 1, 6, 3, 9, 8, 0, 7, 2, 5, 4 ]
//// ```
export function scramble(array, randomAPI) {
  let rand = utils.defaults(randomAPI, config.randomAPI);
  let result = newArray(array, array.length);
  let k = result.length;

  for (let i = 0, imax = result.length; i < imax; i++) {
    result[i] = array[i];
  }

  for (let i = 0, imax = result.length - 1; i < imax; i++) {
    let j = i + ((rand() * k--)|0);

    [ result[i], result[j] ] = [ result[j], result[i] ];
  }

  return result;
}

//// # sc.wrapAt(array, index)
//// same as `at`, but values for index greater than the size of the Array will be wrapped around to 0
//// ### Example
//// ```js
//// sc.wrapAt([ 1, 2, 3, 4 ], 10); // => 3
//// ```
export function wrapAt(array, index) {
  index = (index|0) % array.length;

  if (index < 0) {
    index += array.length;
  }

  return array[index];
}

//// # sc.wrapExtend(array, length)
//// Returns a new Array whose elements are repeated sequences of the receiver, up to size length.
//// ### Example
//// ```js
//// sc.wrapExtend([ 1, 2, 3, 4 ], 10); // => [ 1, 2, 3, 4, 1, 2, 3, 4, 1, 2 ]
//// ```
export function wrapExpand(array, length) {
  length = Math.max(0, length|0);

  let result = newArray(array, length);

  for (let i = 0; i < length; i++) {
    result[i] = wrapAt(array, i);
  }

  return result;
}
