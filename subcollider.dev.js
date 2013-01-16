(function() {
    "use strict";
    
    var subcollider = {};
    
    // ---
    
    // ##### exports
    var exports = subcollider;
    
    if (typeof module !== "undefined" && module.exports) {
        module.exports = exports;
    } else if (typeof window !== "undefined") {
        exports.noConflict = (function() {
            var _subcollider = window.subcollider, _sc = window.sc;
            return function(deep) {
                if (window.sc === exports) {
                    window.sc = _sc;
                }
                if (deep && window.subcollider === exports) {
                    window.subcollider = _subcollider;
                }
                return exports;
            };
        })();
        window.subcollider = window.sc = exports;
    }
})();
