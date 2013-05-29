/**
 * Create a new Array whose slots are filled with the given arguments.
 * @arguments _(... args)_
 */
sc.define("*with", {
  Array: function() {
    return Array.apply(null, arguments);
  }
});
