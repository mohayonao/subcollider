(function(global) {
  "use strict";

  var sc = function() {};


  var exports = sc;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = global.sc = exports;
  } else {
    sc.noConflict = (function() {
      var _sc = window.sc;
      return function() {
        if (window.sc === exports) {
          window.sc = _sc;
        }
        return exports;
      };
    })();
    window.sc = exports;
  }

})(this.self||global);
