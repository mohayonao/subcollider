/**
 * Answer a new collection which consists of all items in the receiver for which function answers True. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("select", {
  Array: function(func) {
    return this.filter(sc.func(func));
  }
});
