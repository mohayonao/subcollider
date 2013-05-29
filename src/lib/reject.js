/**
 * Answer a new collection which consists of all items in the receiver for which *function* answers False. The function is passed two arguments, the item and an integer index.
 * @arguments _(function)_
 */
sc.define("reject", {
  Array: function(func) {
    func = sc.func(func);
    return this.filter(function(x, i) { return !func(x, i); });
  }
});
