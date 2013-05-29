/**
 * Return a new Array whose elements have been reordered via one of 10 "counting" algorithms.
 * @arguments _(patternType)_
 * @example
 *  [1, 2, 3, 4].pyramid(0);
 *  // => [ 1, 1, 2, 1, 2, 3, 1, 2, 3, 4 ]
 */
sc.define("pyramid", {
  Array: function(patternType) {
    patternType = patternType === void 0 ? 1 : patternType;
    var obj1, obj2, i, j, k, n, m, numslots, x;
    obj1 = this;
    obj2 = [];
    m = Math.max(1, Math.min(patternType, 10))|0;
    x = numslots = this.length;
    switch (patternType) {
    case 1:
      n = n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 2:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 3:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 4:
      n = (x * x + x) >> 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 5:
      n = x * x;
      for (i = k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 6:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = i + 1; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 7:
      n = x * x + x - 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= numslots - 1 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 1; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 8:
      n = x * x + x - 1;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 1; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 9:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = 0; j <= i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = i + 1; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    case 10:
      n = x * x;
      for (i = 0, k = 0; i < numslots; ++i) {
        for (j = numslots - 1 - i; j <= numslots - 1; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      for (i = 0; i < numslots - 1; ++i) {
        for (j = 0; j <= numslots - 2 - i; ++j, ++k) {
          obj2[k] = obj1[j];
        }
      }
      break;
    }
    return obj2;
  }
});
