/**
 * Return the index of an *item* in the collection, or -1 if not found.
 * @arguments _(item [, offset=0])_
 */
sc.define(["indexOf", "sc_indexOf"], {
  Array: function(item, offset) {
    offset = offset === void 0 ? 0 : offset;
    return this.indexOf(item, offset|0);
  }
});
