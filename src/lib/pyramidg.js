/**
 * Like `pyramid`, but keep the resulting values grouped in subarrays.
 * @arguments _(patternType)_
 * @example
 *  [1, 2, 3, 4].pyramidg(0);
 *  => [ [ 1 ], [ 1, 2 ], [ 1, 2, 3 ], [ 1, 2, 3, 4 ] ]
 */
sc.define("pyramidg", {
  Array: function(patternType) {
    var list = [], lastIndex, i;
    patternType = patternType === void 0 ? 1 : patternType;
    patternType = Math.max(1, Math.min(patternType, 10))|0;
    lastIndex = this.length - 1;
    switch (patternType) {
    case 1:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 2:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      break;
    case 3:
      for (i = lastIndex; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 4:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 5:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 6:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      break;
    case 7:
      for (i = lastIndex; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      for (i = 1; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      break;
    case 8:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      for (i = lastIndex - 1; i >= 0; --i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 9:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(0, i+1));
      }
      for (i = 1; i <= lastIndex; ++i) {
        list.push(this.slice(i, lastIndex+1));
      }
      break;
    case 10:
      for (i = 0; i <= lastIndex; ++i) {
        list.push(this.slice(lastIndex-i, lastIndex+1));
      }
      for (i = lastIndex-1; i >= 0; --i) {
        list.push(this.slice(0, i+1));
      }
      break;
    }
    return list;
  }
});
