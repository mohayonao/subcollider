(function() {
    "use strict";
    
    var subcollider = {};

    var $num = Number.prototype;
    var $ary = Array .prototype;
    var NOP  = null;
    
    // ## use (type:String)
    // Extending Number/Array prototype
    // ### Examples
    //     sc.use("prototype");
    //     (69).midicps(); //  440
    //     [69].midicps(); // [440]
    subcollider.use = function(type) {
        for (var func in subcollider) {
            if (typeof subcollider[func].use === "function") {
                subcollider[func].use(type);
            }
        }
    };
    
    // ## unuse (type:String)
    // Unextending Number/Array prototype _(default)_
    // ### Examples
    //     sc.unuse("prototype");
    //     sc.midicps( 69 ); //  440
    //     sc.midicps([69]); // [440]
    subcollider.unuse = function(type) {
        for (var func in subcollider) {
            if (typeof subcollider[func].unuse === "function") {
                subcollider[func].unuse(type);
            }
        }
    };
    
    // ## midicps ()
    // Convert MIDI note to cycles per second
    // ### Examples
    //     (69).midicps(); // 440
    //     (81).midicps(); // 880
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_midicps)
    function $num_midicps() {
        return 440 * Math.pow(2, (this - 69) * 1/12);
    }
    function $ary_midicps() {
        var a = new Array(this.length);
        for (var i = a.length; i--; )
            a[i] = 440 * Math.pow(2, (this[i] - 69) * 1/12);
        return a;
    }
    register("midicps", 0, $num_midicps, $ary_midicps);
    
    // ## cpsmidi ()
    // Convert cycles per second to MIDI note
    // ### Examples
    //     (440).cpsmidi(); // 69
    //     (880).cpsmidi(); // 81
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_cpsmidi)
    function $num_cpsmidi() {
        return Math.log(Math.abs(this) * 1/440) * Math.LOG2E * 12 + 69;
    }
    function $ary_cpsmidi() {
        var a = new Array(this.length);
        for (var i = a.length; i--; )
            a[i] = Math.log(Math.abs(this[i]) * 1/440) * Math.LOG2E * 12 + 69;
        return a;
    }
    register("cpsmidi", 0, $num_cpsmidi, $ary_cpsmidi);
    
    // ## midiratio ()
    // Convert an interval in semitones to a ratio
    // ### Examples
    //     ( 0).midiratio(); // 1
    //     (12).midiratio(); // 1.9999...
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_midiratio)
    function $num_midiratio() {
        return Math.pow(2, this * 1/12);
    }
    function $ary_midiratio() {
        var a = new Array(this.length);
        for (var i = a.length; i--; )
            a[i] = Math.pow(2, this[i] * 1/12);
        return a;
    }
    register("midiratio", 0, $num_midiratio, $ary_midiratio);
    
    // ## ratiomidi ()
    // Convert a ratio to an interval in semitones
    // ### Examples
    //     (1).ratiomidi(); // 0
    //     (2).ratiomidi(); // 12
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_ratiomidi)
    function $num_ratiomidi() {
        return Math.log(Math.abs(this)) * Math.LOG2E * 12;
    }
    function $ary_ratiomidi() {
        var a = new Array(this.length);
        for (var i = a.length; i--; )
            a[i] = Math.log(Math.abs(this[i])) * Math.LOG2E * 12;
        return a;
    }
    register("ratiomidi", 0, $num_ratiomidi, $ary_ratiomidi);
    
    // ## ampdb ()
    // Convert a linear amplitude to decibels
    // ### Examples
    //     (1/2).ampdb(); // -6.0205...
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_ampdb)
    function $num_ampdb() {
        return Math.log(this) * Math.LOG10E * 20;
    }
    register("ampdb", 0, $num_ampdb);
    
    // ## dbamp ()
    // Convert a decibels to a linear amplitude
    // ### Examples
    //     (6).dbamp(); // 1.9952...
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_dbamp)
    function $num_dbamp() {
        return Math.pow(10, this * 0.05);
    }
    register("dbamp", 0, $num_dbamp);
    
    // ## octcps ()
    // Convert decimal octaves to cycles per second
    // ### Examples
    //     (4).octcps(); // 261.6255...
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_octcps)
    function $num_octcps() {
        return 440 * Math.pow(2, this - 4.75);
    }
    register("octcps", 0, $num_octcps);
    
    // ## cpsoct ()
    // Convert cycles per second to decimal octaves
    // ### Examples
    //     (261).cpsoct(); // 3.9965...
    // > /SC-Source/include/plugin\_interface/SC\_InlineUnaryOp.h (sc\_cpsoct)
    function $num_cpsoct() {
        return Math.log(Math.abs(this) * 1/440) * Math.LOG2E + 4.75;
    }
    register("cpsoct", 0, $num_cpsoct);
    
    // ## clip (lo, hi)
    // Clipping at lo and hi
    // ### Examples
    //     (0).clip(2, 8); // 2
    //     (5).clip(2, 8); // 5
    //     (9).clip(2, 8); // 8
    // > /SC-Source/include/common/SC\_BoundMacros.h (sc\_clip)
    function $num_clip(lo, hi) {
        if (lo <= hi) {
            return this < lo ? lo : this < hi ? this : hi;
        } else {
            return $num_clip.call(this, hi, lo);
        }
    }
    register("clip", 2, $num_clip);
    
    // ## wrap (lo, hi)
    // Wrapping at lo and hi
    // ### Examples
    //     ( 0).wrap(2, 8); // 7
    //     ( 5).wrap(2, 8); // 5
    //     ( 9).wrap(2, 8); // 2
    // > /SC-Source/include/plugin\_interface/SC\_InlineBinaryOp.h (sc\_wrap)
    function $num_wrap(lo, hi) {
        if (lo <= hi) {
            if (lo <= this && this <= hi) {
                return this;
            }
            var b2 = hi - lo + 1;
            var c  = (this - lo) % b2;
            if (c < 0) c += b2;
            return c + lo;
        } else {
            return $num_wrap.call(this, hi, lo);
        }
    }
    register("wrap", 2, $num_wrap);
    
    // ## fold (lo, hi)
    // Folding at lo and hi
    // ### Examples
    //     ( 0).fold(2, 8); // 4
    //     ( 5).fold(2, 8); // 5
    //     ( 9).fold(2, 8); // 7
    // > /SC-Source/include/plugin\_interface/SC\_InlineBinaryOp.h (sc\_fold)
    function $num_fold(lo, hi) {
        if (lo <= hi) {
            if (lo <= this && this <= hi) {
                return this;
            }
            var b  = hi - lo;
            var b2 = b + b;
            var c  = (this - lo) % b2;
            if (c <  0) c += b2;
            if (c  > b) c = b2 - c;
            return c + lo;
        } else {
            return $num_fold.call(this, hi, lo);
        }
    }
    register("fold", 2, $num_fold);
    
    // ## trunc (quant:Number)
    // Truncate x to multiple of quant
    // > /SC-Source/include/plugin\_interface/SC\_InlineBinaryOp.h (sc\_tranc)
    function $num_trunc(quant) {
        quant = Math.abs(quant);
        return quant === 0 ? this : Math.floor(this / quant) * quant;
    }
    register("trunc", 1, $num_trunc);

    // ## asInteger ()
    // Convert to Integer
    function $num_asInteger() {
        return this|0;
    }
    function $ary_asInteger() {
        var a = new Array(this.length);
        for (var i = a.length; i--; )
            a[i] = this[i]|0;
        return a;
    }
    register("asInteger", 0, $num_asInteger, $ary_asInteger);
    
    
    // # Array Functions
    
    // ## sc.fill (size:uint, item=0)
    // Creates an array of the given size, the elements of which are determined by evaluation the given function.
    // > /SC-Source/SCClassLibray/Common/Collections/Collection.sc
    function fill(size, item) {
        size = Math.max(0, size|0);
        if (typeof item === "undefined") {
            item = 0;
        }
        var i, a = new Array(size);
        if (typeof item === "function") {
            for (i = 0; i < size; ++i) {
                a[i] = item(i);
            }
        } else {
            for (i = size; i--; ) {
                a[i] = item;
            }
        }
        return a;
    }
    subcollider.fill = fill;
    
    // ## sc.series (size:uint, start=0, step=1)
    // Fill with ramp of values
    // ### Examples
    //     sc.series(5);        // [ 0, 1, 2, 3, 4 ]
    //     sc.series(5, -6, 3); // [ -6, -3, 0, 3, 6 ]
    // > /SC-Source/SCClassLibray/Common/Collections/SequencableCollection.sc
    function series(size, start, step) {
        size = Math.max(0, size|0);
        start = (typeof start === "number") ? start : 0;
        step  = (typeof step  === "number") ? step  : 1;
        
        var a = new Array(size);
        for (var i = 0, j = start; i < size; ++i, j += step) {
            a[i] = j;
        }
        return a;
    }
    subcollider.series = series;
    
    // ## sc.geom (size:uint, start=1, grow=2)
    // Fill with geometric series
    // ### Examples
    //     sc.geom(5);         // [ 1, 2, 4, 8, 16 ]
    //     sc.geom(5, -11, 3); // [ -11, -33, -99, -297, -891 ]
    // > /SC-Source/SCClassLibray/Common/Collections/SequencableCollection.sc
    function geom(size, start, grow) {
        size = Math.max(0, size|0);
        start = (typeof start === "number") ? start : 1;
        grow  = (typeof grow  === "number") ? grow  : 2;
        
        var a = new Array(size);
        for (var i = 0, j = start; i < size; ++i, j *= grow) {
            a[i] = j;
        }
        return a;
    }
    subcollider.geom = geom;
    
    // ## sc.rand (size:uint, minVal=0, maxVal=1, seed=None)
    // Fill with random values in the range minVal to maxVal
    // > /SC-Source/SCClassLibray/Common/Collections/SequencableCollection.sc
    function rand(size, minVal, maxVal, seed) {
        size = Math.max(0, size|0);
        minVal = (typeof minVal === "number") ? minVal : 0;
        maxVal = (typeof maxVal === "number") ? maxVal : 1;
        
        var a = new Array(size);
        var d = maxVal - minVal;
        var r = new RGen(seed);
        for (var i = size; i--; ) {
            a[i] = (r.next() * d) + minVal;
        }
        return a;
    }
    subcollider.rand = rand;
    
    // ## sc.rand2 (size:uint, val=1, seed=None)
    // Fill with random values in the range -val to +val
    // > /SC-Source/SCClassLibray/Common/Collections/SequencableCollection.sc
    function rand2(size, val, seed) {
        if (val < 0) val *= -1;
        return rand(size, -val, +val, seed);
    }
    subcollider.rand2 = rand2;
    
    // ## at (index:int or Array)
    // Return the item at index. The index can also be an Array of indices to extract specified elements.
    // ### Examples
    //     [0, 1, 2, 3].at( 1); // 1
    //     [0, 1, 2, 3].at( 9); // undefined
    //     [0, 1, 2, 3].at(-6); // undefined
    //     [0, 1, 2, 3].at([1, 9, -6]); // [1, undefined, undefined]
    function $ary_at(index) {
        if (typeof index === "number")
            return this[index|0];
        
        if (Array.isArray(index)) return index.map(function(index) {
            return $ary_at.call(this, index);
        }.bind(this));
    }
    register("at", 1, NOP, $ary_at);
    
    // ## clipAt (index:int or Array)
    // Same as `at`, but values for index greater than the size of the array will be clipped to the last index
    // ### Examples
    //     [0, 1, 2, 3].clipAt( 1); // 1
    //     [0, 1, 2, 3].clipAt( 9); // 3
    //     [0, 1, 2, 3].clipAt(-6); // 0
    //     [0, 1, 2, 3].clipAt([1, 9, -6]); // [1, 3, 0]
    // > /SC-Source/include/common/SC\_BoundsMacros.h (sc\_clip)
    function $ary_clipAt(index) {
        if (typeof index === "number")
            return this[$num_clip.call(index|0, 0, this.length-1)];
        
        if (Array.isArray(index)) {
            var a = new Array(index.length);
            for (var i = a.length; i--; )
                a[i] = this[$num_clip.call(index[i]|0, 0, this.length-1)];
            return a;
        }
    }
    register("clipAt", 1, NOP, $ary_clipAt);
    
    // ## wrapAt (index:int or Array)
    // Same as `at`, but values for index greater than the size of the array will be wrapped around to 0
    // ### Examples
    //     [0, 1, 2, 3].wrapAt( 1); // 1
    //     [0, 1, 2, 3].wrapAt( 9); // 1
    //     [0, 1, 2, 3].wrapAt(-6); // 2
    //     [0, 1, 2, 3].wrapAt([1, 9, -6]); // [1, 1, 2]
    // > /SC-Source/include/plugin\_interface/SC\_InlineBinaryOp.h (sc\_wrap)
    function $ary_wrapAt(index) {
        if (typeof index === "number")
            return this[$num_wrap.call(index|0, 0, this.length-1)];
        
        if (Array.isArray(index)) {
            var a = new Array(index.length);
            for (var i = a.length; i--; )
                a[i] = this[$num_wrap.call(index[i]|0, 0, this.length-1)];
            return a;
        }
    }
    register("wrapAt", 1, NOP, $ary_wrapAt);
    
    // ## foldAt (index:int or Array)
    // Same as `at`, but values for index greater than the size of the array will be folded back.
    // ### Examples
    //     [0, 1, 2, 3].foldAt( 1); // 1
    //     [0, 1, 2, 3].foldAt( 9); // 3
    //     [0, 1, 2, 3].foldAt(-6); // 9
    //     [0, 1, 2, 3].foldAt([1, 9, -6]); // [1, 3, 9]
    // > /SC-Source/include/plugin\_interface/SC\_InlineBinaryOp.h (sc\_fold)
    function $ary_foldAt(index) {
        if (typeof index === "number")
            return this[$num_fold.call(index|0, 0, this.length-1)];
        
        if (Array.isArray(index)) {
            var a = new Array(index.length);
            for (var i = a.length; i--; )
                a[i] = this[$num_fold.call(index[i]|0, 0, this.length-1)];
            return a;
        }
    }
    register("foldAt", 1, NOP, $ary_foldAt);

    // ## first ()
    // Return the first element of the array
    // ### Examples
    //     [1, 2, 3].first(); // 1
    //     [       ].first(); // undefined
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_first() {
        return this[0];
    }
    register("first", 0, NOP, $ary_first);
    
    // ## last ()
    // Return the last element of the array
    // ### Examples
    //     [1, 2, 3].last(); // 3
    //     [       ].last(); // undefined
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_last() {
        return this[this.length - 1];
    }
    register("last", 0, NOP, $ary_last);
    
    // ## add (item)
    // Adds an item to the Array
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_add(item) {
        this.push(item);
        return this;
    }
    register("add", 1, NOP, $ary_add);
    
    // ## addAll (aCollection:Array)
    // Adds all the elements to the array
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_addAll(aCollection) {
        for (var i = 0, imax = aCollection.length; i < imax; ++i)
            this.push(aCollection[i]);
        return this;
    }
    register("addAll", 1, NOP, $ary_addAll);
    
    // ## insert (index:int, item)
    // Inserts the item into the contents of the array
    // ### Examples
    //     [ 1, 2, 3, 4 ].insert(3, 10); // [ 1, 2, 3, 10, 4 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_insert(index, item) {
        index = Math.max(0, index|0);
        this.splice(index, 0, item);
        return this;
    }
    register("insert", 2, NOP, $ary_insert);
    
    // ## removeAt (index:int)
    // Remove and return the element at index
    // ### Examples
    //     a = [ 1, 2, 3, 4, 5 ];
    //     a.removeAt(3); // 4, a is [ 1, 2, 3, 5 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_removeAt(index) {
        if (index >= 0) {
            return this.splice(index|0, 1)[0];
        }
    }
    register("removeAt", 1, NOP, $ary_removeAt);
    
    // ## takeAt (index:int)
    // Similar to `removeAt`, but does not maintain the order of the items following the one that was removed. Instead, the last item is placed into the position of the removed item and the array's size decreases by one.
    // ### Examples
    //     a = [ 1, 2, 3, 4, 5 ];
    //     a.takeAt(2); // 3, a is [ 1, 2, 5, 4 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_takeAt(index) {
        index |= 0;
        if (0 <= index && index < this.length) {
            var retVal = this[index];
            var instead = this.pop();
            if (index !== this.length) {
                this[index] = instead;
            }
            return retVal;
        }
    }
    register("takeAt", 1, NOP, $ary_takeAt);
    
    // ## remove (item)
    // Remove item from the array
    // ### Examples
    //     a = [ 1, 2, 3, 4 ];
    //     a.remove(1); // 1, a is [ 2, 3, 4 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_remove(item) {
        var index = this.indexOf(item);
        if (index !== -1) {
            return this.splice(index, 1)[0];
        }
    }
    register("remove", 1, NOP, $ary_remove);
    
    // ## take (item)
    // Remove and return item from the array. The last item in the collection will move to occupy the vacated slot (and the collection size decreases by one).
    // ### Examples
    //     a = [ 1, 2, 3, 4 ];
    //     a.take(1); // 1, a is [ 4, 2, 3 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_take(item) {
        var index = this.indexOf(item);
        if (index !== -1) {
            return $ary_takeAt.call(this, index);
        }
    }
    register("take", 1, NOP, $ary_take);
    
    // ## put (index:int or Array, item)
    // Put item at index, replacing what is there
    // ### Examples
    //     [ 1, 2, 3, 4 ].put( 1, 10); // [ 1,10, 3, 4 ]
    //     [ 1, 2, 3, 4 ].put(-1, 10); // [ 1, 2, 3, 4 ]
    //     [ 1, 2, 3, 4 ].put([1,2,98], 10); // [ 1,10,10, 4 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp (basicPut)
    function $ary_put(index, item) {
        if (typeof index === "number") {
            if (0 <= index && index < this.length) {
                this[index|0] = item;
            }
        } else if (Array.isArray(index)) {
            for (var i = index.length; i--; ) {
                $ary_put.call(this, index[i], item);
            }
        }
        return this;
    }
    register("put", 2, NOP, $ary_put);
    
    // ## clipPut (index:int or Array, item)
    // Same as `put`, but values for index greater than the size of the array will be clipped to the last index
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp (basicClipPut)
    function $ary_clipPut(index, item) {
        if (typeof index === "number") {
            this[$num_clip.call(index, 0, this.length-1)] = item;
        } else if (Array.isArray(index)) {
            for (var i = index.length; i--; ) {
                this[$num_clip.call(index[i], 0, this.length-1)] = item;
            }
        }
        return this;
    }
    register("clipPut", 2, NOP, $ary_clipPut);
    
    // ## wrapPut (index:int or Array, item)
    // Same as `put`, but values for index greater than the size of the array will be wrapped around to 0
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp (basicWrapPut)
    function $ary_wrapPut(index, item) {
        if (typeof index === "number") {
            this[$num_wrap.call(index, 0, this.length-1)] = item;
        } else if (Array.isArray(index)) {
            for (var i = index.length; i--; ) {
                this[$num_wrap.call(index[i], 0, this.length-1)] = item;
            }
        }
        return this;
    }
    register("wrapPut", 2, NOP, $ary_wrapPut);
    
    // ## foldPut (index:int or Array, item)
    // Same as `put`, but values for index greater than the size of the array will be folded back
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp (basicFoldPut)
    function $ary_foldPut(index, item) {
        if (typeof index === "number") {
            this[$num_fold.call(index, 0, this.length-1)] = item;
        } else if (Array.isArray(index)) {
            for (var i = index.length; i--; ) {
                this[$num_wrap.call(index[i], 0, this.length-1)] = item;
            }
        }
        return this;
    }
    register("foldPut", 2, NOP, $ary_foldPut);
    
    // ## putFirst (obj)
    // Place item at the first index in the array.
    // Note that if the array is empty (and therefore has no indexed slots) the item will not be added.
    // ### Examples
    //     [1, 2, 3].putFirst(0); // [0, 2, 3]
    //     [       ].putFirst(1); // [       ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_putFirst(obj) {
        if (this.length > 0) this[0] = obj;
        return this;
    }
    register("putFirst", 1, NOP, $ary_putFirst);
    
    // ## putLast (obj)
    // Place item at the last index in the array.
    // Note that if the array is empty (and therefore has no indexed slots) the item will not be added.
    // ### Examples
    //     [1, 2, 3].putLast(4); // [1, 2, 4]
    //     [       ].putLast(1); // [       ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_putLast(obj) {
        if (this.length > 0) this[this.length - 1] = obj;
        return this;
    }
    register("putLast", 1, NOP, $ary_putLast);
    
    // ## swap (i:int, j:int)
    // Swap the values at indices i and j
    // ### Examples
    //     [ 1, 2, 3 ].swap(0, 2); // [ 3, 2, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp (basicSwap)
    function $ary_swap(i, j) {
        if (0 <= i && i < this.length && 0 <= j && j < this.length) {
            var t = this[i|0]; this[i|0] = this[j|0]; this[j|0] = t;
        }
        return this;
    }
    register("swap", 2, NOP, $ary_swap);
    
    // ## clipSwap (i:int, j:int)
    // Same as 'swap', but values for index greater than the size of the array will be clipped to the last index
    function $ary_clipSwap(i, j) {
        i = $num_clip.call(i|0, 0, this.length-1);
        j = $num_clip.call(j|0, 0, this.length-1);
        var t = this[i]; this[i] = this[j]; this[j] = t;
        return this;
    }
    register("clipSwap", 2, NOP, $ary_clipSwap);
    
    // ## wrapSwap (i:int, j:int)
    // Same as 'swap', but values for index greater than the size of the array will be wrapped around to 0
    function $ary_wrapSwap(i, j) {
        i = $num_wrap.call(i|0, 0, this.length-1);
        j = $num_wrap.call(j|0, 0, this.length-1);
        var t = this[i]; this[i] = this[j]; this[j] = t;
        return this;
    }
    register("wrapSwap", 2, NOP, $ary_wrapSwap);
    
    // ## foldSwap (i:int, j:int)
    // Same as 'swap', but values for index greater than the size of the array will be folded back.
    function $ary_foldSwap(i, j) {
        i = $num_fold.call(i|0, 0, this.length-1);
        j = $num_fold.call(j|0, 0, this.length-1);
        var t = this[i]; this[i] = this[j]; this[j] = t;
        return this;
    }
    register("foldSwap", 2, NOP, $ary_foldSwap);
    
    // ## includes (item)
    // Return a boolean indicating whether the Array contains anything matching item.
    // > /SC-Source/SCClassLibrary/Common/Collections/ArrayedCollection.sc
    function $ary_includes(item) {
        return this.indexOf(item) !== -1;
    }
    register("includes", 1, NOP, $ary_includes);
    
    // ## indexOfGreaterThan (val)
    // Return the first index containing an item which is greater than item
    // ### Examples
    //     [ 10, 5, 77, 55, 12, 123 ].indexOfGreaterThan(70); // 2
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_indexOfGreaterThan(val) {
        for (var i = 0, imax = this.length; i < imax; ++i) {
            if (this[i] > val) return i;
        }
        return -1;
    }
    register("indexOfGreaterThan", 1, NOP, $ary_indexOfGreaterThan);
    
    // ## indexIn (val)
    // Returns the closest index of the value in the array (array must be sorted)
    // ### Examples
    //     [2, 3, 5, 6].indexIn(5.2); // 2
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_indexIn(val) {
        var j = $ary_indexOfGreaterThan.call(this, val);
        if (j === -1) return this.length - 1;
        if (j ===  0) return j;
        var i = j - 1;
        return ((val - this[i]) < (this[j] - val)) ? i : j;
    }
    register("indexIn", 1, NOP, $ary_indexIn);
    
    // ## indexInBetween (val)
    // Returns a linearly interpolated float index for the value (array must be sorted)
    // ### Examples
    //     [2, 3, 5, 6].indexInBetween(5.2); // 2.2
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_indexInBetween(val) {
        var i = $ary_indexOfGreaterThan.call(this, val);
        if (i === -1) return this.length - 1;
        if (i ===  0) return i;
        var a = this[i-1], b = this[i], div = b - a;
        if (div === 0) return i;
        return ((val - a) / div) + i - 1;
    }
    register("indexInBetween", 1, NOP, $ary_indexInBetween);
    
    // ## find (sublist:Array, offset:int=0)
    // If the sublist exists in the receiver (in the specified order), at an offset greater than or equal to the initial offset, then return the starting index.
    // ### Examples
    //     [ 1, 2, 3, 4, 5 ].find([2,3]); // 1
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_find(sublist, offset) {
        if (!Array.isArray(sublist)) {
            return -1;
        }
        offset = Math.max(0, offset|0);
        for (var i = offset, imax = this.length; i < imax; ++i) {
            var b = true;
            for (var j = 0, jmax = sublist.length; j < jmax; j++) {
                if (this[i + j] !== sublist[j]) {
                    b = false; break;
                }
            }
            if (b) return i;
        }
        return -1;
    }
    register("find", 2, NOP, $ary_find);
    
    // ## findAll (sublist:Array, offset:int=0)
    // Similar to `find` but returns an array of all the indices at which the sequence is found.
    // ### Examples
    //     [ 1, 2, 3, 2, 3, 4, 5 ].findAll([2,3]); // [ 1, 3 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_findAll(sublist, offset) {
        var a = [];
        if (!Array.isArray(sublist)) {
            return a;
        }
        offset = Math.max(0, offset|0);
        for (var i = offset, imax = this.length; i < imax; ++i) {
            var b = true;
            for (var j = 0, jmax = sublist.length; j < jmax; ++j) {
                if (this[i + j] !== sublist[j]) {
                    b = false; break;
                }
            }
            if (b) a.push(i);
        }
        return a;
    }
    register("findAll", 2, NOP, $ary_findAll);
    
    // ## indicesOfEqual (item)
    // Return an array of indices of things in the array that equal the item
    // ### Examples
    //     [ 1, 2, 3, 1, 2, 3 ].indicesOfEqual(1); // [ 0, 3 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_indicesOfEqual(item) {
        var a = [];
        for (var i = this.length; i--; ) {
            if (this[i] === item) a.unshift(i);
        }
        return a;
    }
    register("indicesOfEqual", 1, NOP, $ary_indicesOfEqual);
    
    // ## copyRange (start:int, end:int)
    // Return a new Array which is a copy of the indexed slots of the receiver from 'start' to 'end'.
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_copyRange(start, end) {
        start = Math.max(0, start|0);
        end   = Math.max(0, end|0);
        return this.slice(start, end + 1);
    }
    register("copyRange", 2, NOP, $ary_copyRange);
    
    // ## copyToEnd (start:int)
    // Return a new Array which is a copy of the indexed slots of the receiver from 'start' to the end of the array.
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_copyToEnd(start) {
        start = Math.max(0, start|0);
        return this.slice(start);
    }
    register("copyToEnd", 1, NOP, $ary_copyToEnd);
    
    // ## copyFromStart (end:int)
    // Return a new Array which is a copy of the indexed slots of the receiver from the start of the array to 'end'.
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_copyFromStart(end) {
        end = Math.max(0, end|0);
        return this.slice(0, end + 1);
    }
    register("copyFromStart", 1, NOP, $ary_copyFromStart);
    
    // ## keep (n:int)
    // Keep the first n items of the array. If n is negative, keep the last -n items.
    // ### Examples
    //     [ 1, 2, 3 ].keep( 1); // [ 1 ]
    //     [ 1, 2, 3 ].keep(-2); // [ 2, 3 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_keep(n) {
        n |= 0;
        if (n < 0) {
            return this.slice(this.length + n, this.length);
        } else {
            return this.slice(0, n);
        }
    }
    register("keep", 1, NOP, $ary_keep);
    
    // ## drop (n:int)
    // Drop the first n items of the array. If n is negative, drop the last -n items.
    // ### Examples
    //     [ 1, 2, 3 ].drop( 1); // [ 2, 3 ]
    //     [ 1, 2, 3 ].drop(-2); // [ 1 ]
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_drop(n) {
        n |= 0;
        if (n < 0) {
            return this.slice(0, this.length + n);
        } else {
            return this.slice(n, this.length);
        }
    }
    register("drop", 1, NOP, $ary_drop);
    
    // ## scramble ()
    // Returns a new Array whose elements have been scrambled. The receiver is unchanged.
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_scramble() {
        var a = this.slice(0);
        var i, j, t, m, k = a.length;
        for (i = 0, m = k; i < k - 1; i++, m--) {
            j = i + ((Math.random() * m)|0);
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
        return a;
    }
    register("scramble", 0, NOP, $ary_scramble);
    
    // ## mirror ()
    // Return a new Array which is the receiver made into a palindrome. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3, 4 ].mirror(); // [ 1, 2, 3, 4, 3, 2, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_mirror() {
        var size = this.length * 2 - 1;
        if (size < 2) {
            return this.slice(0);
        }
        var i, j, imax, a = new Array(size);
        for (i = 0, imax = this.length; i < imax; ++i) {
            a[i] = this[i];
        }
        for (j = imax - 2, imax = size; i < imax; ++i, --j) {
            a[i] = this[j];
        }
        return a;
    }
    register("mirror", 0, NOP, $ary_mirror);

    // ## mirror1 ()
    // Return a new Array which is the receiver made into a palindrome with the last element removed. This is useful if the list will be repeated cyclically, the first element will not get played twice. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3, 4 ].mirror1(); // [ 1, 2, 3, 4, 3, 2 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_mirror1() {
        var size = this.length * 2 - 2;
        if (size < 2) {
            return this.slice(0);
        }
        var i, j, imax, a = new Array(size);
        for (i = 0, imax = this.length; i < imax; ++i) {
            a[i] = this[i];
        }
        for (j = imax - 2, imax = size; i < imax; ++i, --j) {
            a[i] = this[j];
        }
        return a;
    }
    register("mirror1", 0, NOP, $ary_mirror1);
    
    // ## mirror2 ()
    // Return a new Array which is the receiver concatenated with a reversal of itself. The center element is duplicated. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3, 4 ].mirror2(); // [ 1, 2, 3, 4, 4, 3, 2, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_mirror2() {
        var size = this.length * 2;
        if (size < 2) {
            return this.slice(0);
        }
        var i, j, imax, a = new Array(size);
        for (i = 0, imax = this.length; i < imax; ++i) {
            a[i] = this[i];
        }
        for (j = imax - 1, imax = size; i < imax; ++i, --j) {
            a[i] = this[j];
        }
        return a;
    }
    register("mirror2", 0, NOP, $ary_mirror2);
    
    // ## stutter (n:int=2)
    // Return a new Array whose elements are repeated n times. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3 ].stutter(3); // [ 1,1,1, 2,2,2, 3,3,3 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_stutter(n) {
        n = (typeof n !== "number") ? 2 : Math.max(0, n|0);
        var a = new Array(this.length * n);
        for (var i = 0, j = 0, imax = this.length; i < imax; ++i) {
            for (var k = 0; k < n; ++k, ++j) {
                a[j] = this[i];
            }
        }
        return a;
    }
    register("stutter", 1, NOP, $ary_stutter);
    
    // ## rotate (n:int=1)
    // Return a new Array whose elements are in rotated order. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3 ].rotate( 1); // [ 3, 1, 2 ]
    //     [ 1, 2, 3 ].rotate(-1); // [ 2, 3, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_rotate(n) {
        n = (typeof n !== "number") ? 1 : n|0;
        var a = new Array(this.length);
        var size = a.length;
        n %= size;
        if (n < 0) n = size + n;
        for (var i = 0, j = n; i < size; ++i) {
            a[j] = this[i];
            if (++j >= size) j = 0;
        }
        return a;
    }
    register("rotate", 1, NOP, $ary_rotate);
    
    // ## sputter (probability=0.25, maxlen:int=100)
    // Return a new Array of length maxlen with the items partly repeated (random choice of given probability).
    // > /SC-Source/SCClassLibrary/Common/Collections/Array.sc
    function $ary_sputter(probability, maxlen) {
        probability = (typeof probability !== "number") ? 0.25 : probability;
        maxlen      = (typeof maxlen      !== "number") ?  100 : maxlen|0;
        var a = [], i = 0, j = 0, size = this.length;
        while (i < size && j < maxlen) {
            a[j++] = this[i];
            if (probability < Math.random()) i += 1;
        }
        return a;
    }
    register("sputter", 2, NOP, $ary_sputter);

    // ## lace (size:int)
    // Returns a new Array whose elements are interlaced sequences of the elements of the receiver's subcollections, up to size length. The receiver is unchanged.
    // ### Examples
    //     [[1,2,3], 0].lace(7); // [ 1, 0, 2, 0, 3, 0, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_lace(size) {
        size = Math.max(1, size|0);
        var a = new Array(size);
        var v, wrap = this.length;
        for (var i = size; i--; ) {
            v = this[i % wrap];
            a[i] = Array.isArray(v) ? v[ ((i/wrap)|0) % v.length ] : v;
        }
        return a;
    }
    register("lace", 1, NOP, $ary_lace);
    
    // ## extend (size:int, item)
    // Extends the receiver to match size by adding a number of items. If size is less than receiver size then truncate.
    // ### Examples
    //     [ 1, 2, 3, 4 ].extend(6, 0); // [ 1, 2, 3, 4, 0, 0 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_extend(size, item) {
        size = Math.max(0, size|0);
        var a = new Array(size);
        for (var i = size; i--; ) {
            a[i] = (i < this.length) ? this[i] : item;
        }
        return a;
    }
    register("extend", 2, NOP, $ary_extend);
    
    // ## clipExtend (size:int)
    // Same as wrapExtend but the sequences "clip" (return their last element) rather than wrapping.
    // ### Examples
    //     [ 1, 2, 3, 4 ].clipExtend(9); // [ 1, 2, 3, 4, 4, 4, 4, 4, 4 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_clipExtend(size) {
        size = Math.max(0, size|0);
        if (this.length < size) {
            var a = new Array(size);
            for (var i = 0, imax = this.length; i< imax; ++i) {
                a[i] = this[i];
            }
            for (var b = a[i-1]; i < size; ++i) {
                a[i] = b;
            }
            return a;
        } else {
            return this.slice(0, size);
        }
    }
    register("clipExtend", 1, NOP, $ary_clipExtend);
    
    // ## wrapExtend (size:int)
    // Returns a new Array whose elements are repeated sequences of the receiver, up to size length. The receiver is unchanged.
    // ### Examples
    //     [ 1, 2, 3, 4 ].wrapExtend(9); // [ 1, 2, 3, 4, 1, 2, 3, 4, 1 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_wrapExtend(size) {
        size = Math.max(0, size|0);
        var a = new Array(size);
        for (var i = size; i--; ) {
            a[i] = this[i % this.length];
        }
        return a;
    }
    register("wrapExtend", 1, NOP, $ary_wrapExtend);
    
    // ## foldExtend (size:int)
    // Same as wrapExtend but the sequences fold back on the list elements.
    // ### Examples
    //     [ 1, 2, 3, 4 ].foldExtend(9); // [ 1, 2, 3, 4, 3, 2, 1, 2, 3 ]
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_foldExtend(size) {
        size = Math.max(0, size|0);
        var a = new Array(size);
        for (var i = size; i--; ) {
            a[i] = $ary_foldAt.call(this, i);
        }
        return a;
    }
    register("foldExtend", 1, NOP, $ary_foldExtend);

    // ## choose ()
    // Choose an element from the array at random
    // ### Examples
    //     [1, 2, 3, 4].choose();
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_choose() {
        return this[(Math.random() * this.length)|0];
    }
    register("choose", 0, NOP, $ary_choose);
    
    // ## wchoose (weights)
    // Choose an element from the array at random using a list of probabilities or weights. The weights must sum to 1.0
    // ### Examples
    //     [ 1, 2, 3, 4 ].wchoose([ 0.1, 0.2, 0.3, 0.4 ]);
    // > /SC-Source/lang/LangPrimSource/PyrArrayPrimitives.cpp
    function $ary_wchoose(weights) {
        var sum = 0;
        for (var i = 0, imax = weights.length; i < imax; ++i) {
            sum += weights[i];
            if (sum >= Math.random()) {
                return this[i];
            }
        }
        return this[weights.length - 1];
    }
    register("wchoose", 1, NOP, $ary_wchoose);
    
    // ## performDegreeToKey (scaleDegree, stepsPerOctave=12, accidental=0)
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_performDegreeToKey(scaleDegree, stepsPerOctave, accidental) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = 12;
        if (typeof accidental     !== "number") accidental     =  0;
        var baseKey = (stepsPerOctave * ((scaleDegree / this.length)|0)) +
            $ary_wrapAt.call(this, scaleDegree);
        return accidental === 0 ? baseKey :
            baseKey + (accidental * (stepsPerOctave / 12));
    }
    register("performDegreeToKey", 3, NOP, $ary_performDegreeToKey);
    
    // ## performKeyToDegree (degree, stepsPerOctave=12)
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_performKeyToDegree(degree, stepsPerOctave) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = 12;
        var n = ((degree / stepsPerOctave)|0) * this.length;
        var key = degree % stepsPerOctave;
        return $ary_indexInBetween.call(this, key) + n;
    }
    register("performKeyToDegree", 2, NOP, $ary_performKeyToDegree);
    
    // ## performNearestInList (degree)
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_performNearestInList(degree) {
        return this[$ary_indexIn.call(this, degree)];
    }
    register("performNearestInList", 1, NOP, $ary_performNearestInList);
    
    // ## performNearestInScale (degree, stepsPerOctave=12)
    // > /SC-Source/SCClassLibrary/Common/Collections/SequenceableCollection.sc
    function $ary_performNearestInScale(degree, stepsPerOctave) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = 12;
        var root = $num_trunc.call(degree, stepsPerOctave);
        var key  = degree % stepsPerOctave;
        return $ary_performNearestInList.call(this, key) + root;
    }
    register("performNearestInScale", 2, NOP, $ary_performNearestInScale);
    
    // ## size ()
    // Return the number of elements the Array
    // > /SC-Source/SCClassLibrary/Common/Collections/Collection.sc
    function $ary_size() {
        return this.length;
    }
    register("size", 0, NOP, $ary_size);
    
    // ## isEmpty ()
    // Answer whether the array contains no objects
    // > /SC-Source/SCClassLibrary/Common/Collections/Collection.sc
    function $ary_isEmpty() {
        return this.length === 0;
    }
    register("isEmpty", 0, NOP, $ary_isEmpty);
    
    // ## equals (argArray:Array)
    // Answer whether the array equals anotherArray
    // > /SC-Source/SCClassLibrary/Common/Collections/Collection.sc
    function $ary_equals(argArray) {
        if (!(Array.isArray(argArray) && this.length === argArray.length))
            return false;
        
        for (var i = this.length; i--; ) {
            if (Array.isArray(this[i])) {
                if (!$ary_equals.call(this[i], argArray[i])) {
                    return false;
                }
            } else if (this[i] !== argArray[i]) {
                return false;
            }
        }
        return true;
    }
    register("equals", 1, NOP, $ary_equals);
    
    // # Pattern
    function Pattern() {
        this.count = 0;
    }
    Pattern.prototype.next = function() {
        return null;
    };
    Pattern.prototype.valueOf = function(item) {
        return (typeof item.next === "function") ? item.next() : item;
    };
    Pattern.prototype.reset = function() {
        this.count = 0;
    };
    
    // ## Pser : Pattern
    function Pser(list, repeats, offset) {
        Pattern.call(this);
        repeats = (typeof repeats === "number") ? repeats : 1;
        offset  = (typeof offset  === "number") ? offset  : 0;
        
        this.list = list;
        this.repeats = Math.max(0, repeats|0);
        this.offset  = Math.max(0, offset |0);
    }
    extend(Pser, Pattern);
    
    Pser.prototype.next = function() {
        if (this.count >= this.repeats) {
            return null;
        }
        var index = (this.count + this.offset) % this.list.length;
        var item  = this.list[index];
        var value = this.valueOf(item);
        if (value !== null) {
            if (typeof item.next !== "function") {
                this.count += 1;
            }
            return value;
        } else {
            if (typeof item.reset === "function") {
                item.reset();
            }
            this.count += 1;
            return this.next();
        }
    };
    subcollider.Pser = Pser;
    
    // ## Pseq : Pser
    function Pseq(list, repeats, offset) {
        Pser.call(this, list, repeats, offset);
        this.repeats *= list.length;
    }
    extend(Pseq, Pser);
    
    subcollider.Pseq = Pseq;
    
    // ## Pshuf : Pser
    function Pshuf(list, repeats, seed) {
        Pser.call(this, list, repeats, 0);
        var rand = new RGen(seed);
        this.list.sort(function() {
            return rand.next() - 0.5;
        });
    }
    extend(Pshuf, Pser);
    
    subcollider.Pshuf = Pshuf;

    // ## Prand : Pattern
    function Prand(list, repeats, seed) {
        Pser.call(this, list, repeats, 0);
        var rand = new RGen(seed);
        this._rand = rand.next.bind(rand);
    }
    extend(Prand, Pattern);
    
    Prand.prototype.next = function() {
        if (this.count >= this.repeats) {
            return null;
        }
        var index = (this._rand() * this.list.length)|0;
        var item  = this.list[index];
        var value = this.valueOf(item);
        if (value !== null) {
            if (typeof item.next !== "function") {
                this.count += 1;
            }
            return value;
        } else {
            if (typeof item.reset === "function") {
                item.reset();
            }
            this.count += 1;
            return this.next();
        }
    };
    subcollider.Prand = Prand;
    
    // ## Pseries : Pattern
    function Pseries(start, step, length) {
        Pattern.call(this);
        start  = (typeof start  === "number") ? start  : 0;
        length = (typeof length === "number") ? length : Infinity;
        
        this.start  = start;
        this.value  = this.start;
        this.step   = step || 1;
        this.length = Math.max(0, length|0);
    }
    extend(Pseries, Pattern);
    
    Pseries.prototype.next = function() {
        if (this.count < this.length) {
            var step = this.valueOf(this.step);
            if (step !== null) {
                var outval = this.value;
                this.value += step;
                this.count += 1;
                return outval;
            }
        }
        return null;
    };
    subcollider.Pseries = Pseries;

    // ## Pgeom : Pattern
    function Pgeom(start, grow, length) {
        Pattern.call(this);
        start  = (typeof start  === "number") ? start  : 0;
        length = (typeof length === "number") ? length : Infinity;
        
        this.start  = start;
        this.value  = this.start;
        this.grow   = grow || 1;
        this.length = Math.max(0, length|0);
    }
    extend(Pgeom, Pattern);
    
    Pgeom.prototype.next = function() {
        if (this.count < this.length) {
            var grow = this.valueOf(this.grow);
            if (grow !== null) {
                var outval = this.value;
                this.value *= grow;
                this.count += 1;
                return outval;
            }
        }
        return null;
    };
    subcollider.Pgeom = Pgeom;
    
    
    // # Scale
    // Scale supports arbitary octave divisions and ratios, and(in conjunction with Tuning) can generate pitch information in various aways.
    // > /SC-Source/SCClassLibrary/Common/Collections/Scale.sc
    
    // ## Constructor
    function Scale(degrees, pitchesPerOctave, tuning, name) {
        if (!Array.isArray(degrees)) {
            degrees = [0,2,4,5,7,9,11]; // ionian
        }
        if (typeof pitchesPerOctave !== "number") {
            pitchesPerOctave = Scale.guessPPO(degrees);
        }
        var _name;
        if (typeof tuning === "string") {
            _name = tuning;
            tuning = subcollider.TuningInfo.at(tuning);
        }
        if (!(tuning instanceof subcollider.Tuning)) {
            tuning = subcollider.Tuning["default"](pitchesPerOctave);
        }
        if (name === undefined) {
            name = _name;
        }
        if (typeof name !== "string") {
            name = "Unknown Scale";
        }
        this.name = name;
        this._degrees = degrees;
        this._pitchesPerOctave = pitchesPerOctave;
        this.tuning(tuning);
    }
    subcollider.Scale = Scale;
    
    // ## tuning (inTuning:Tuning)
    // Sets or gets the tuning of the Scale.
    Scale.prototype.tuning = function(inTuning) {
        if (inTuning === undefined) {
            return this._tuning;
        }
        if (typeof inTuning === "string") {
            inTuning = subcollider.TuningInfo.at(inTuning);
        }
        if (!(inTuning instanceof subcollider.Tuning) ) {
            console.warn("The first argument must be instance of Tuning");
            return;
        }
        if (this._pitchesPerOctave !== inTuning.size()) {
            console.warn("Scale steps per octave " + this._pitchesPerOctave + " does not match tuning size ");
            return;
        }
        this._tuning = inTuning;
        this._ratios = $ary_midiratio.call(this.semitones());
        
        return inTuning;
    };
    
    // ## semitones ()
    // Returns a tuned array of semitone values
    Scale.prototype.semitones = function() {
        return this._degrees.map(this._tuning.wrapAt.bind(this._tuning));
    };
    
    // ## cents ()
    // Returns a turned array of cent values
    Scale.prototype.cents = function() {
        return this.semitones().map(function(x) {
            return x * 100;
        });
    };
    
    // ## ratios ()
    // Return a turned array of ratios
    Scale.prototype.ratios = function() {
        return this._ratios;
    };
    
    // ## size ()
    // Returns the length of the scale
    Scale.prototype.size = function() {
        return this._degrees.length;
    };
    
    // ## pitchesPerOctave ()
    // Returns the size of the pitch class set from which the tuning is drawn
    Scale.prototype.pitchesPerOctave = function() {
        return this._pitchesPerOctave;
    };
    
    // ## stepsPerOctave ()
    // Usually 12, but may be different if the current tuning has a stretched or compressed octave. Needed for degreeToKey
    Scale.prototype.stepsPerOctave = function() {
        return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
    };
    
    // ## at (index:int)
    Scale.prototype.at = function(index) {
        return this._tuning.at($ary_wrapAt.call(this._degrees, index));
    };
    
    // ## wrapAt (index:int)
    Scale.prototype.wrapAt = function(index) {
        return this._tuning.wrapAt($ary_wrapAt.call(this._degrees, index));
    };

    // ## degreeToFreq (degree, rootFreq, octave)
    Scale.prototype.degreeToFreq = function(degree, rootFreq, octave) {
        return this.degreeToRatio(degree, octave) * rootFreq;
    };
    
    // ## degreeToRatio (degree, octave=0)
    Scale.prototype.degreeToRatio = function(degree, octave) {
        if (typeof octave !== "number") octave = 0;
        octave += (degree / this._degrees.length)|0;
        return $ary_wrapAt.call(this.ratios(), degree) *
            Math.pow(this.octaveRatio(), octave);
    };
    
    // ## checkTuningForMismatch (aTuning)
    Scale.prototype.checkTuningForMismatch = function(aTuning) {
        return this._pitchesPerOctave === aTuning.size();
    };
    
    // ## degrees ()
    Scale.prototype.degrees = function() {
        return this._degrees;
    };
    
    // ## guessPPO ()
    Scale.prototype.guessPPO = function() {
        return Scale.guessPPO(this._degrees);
    };
    
    // ## octaveRatio ()
    Scale.prototype.octaveRatio = function() {
        return this._tuning.octaveRatio();
    };
    
    // ## performDegreeToKey (scaleDegree, stepsPerOctave, accidental=0)
    Scale.prototype.performDegreeToKey = function(scaleDegree, stepsPerOctave, accidental) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = this.stepsPerOctave();
        if (typeof accidental     !== "number") accidental     = 0;
        var basekey = this.wrapAt(scaleDegree);
        basekey += stepsPerOctave * ((scaleDegree / this.size())|0);
        if (accidental === 0) {
            return basekey;
        } else {
            return basekey + (accidental * (stepsPerOctave / 12));
        }
    };
    
    // ## performKeyToDegree (degree, stepsPerOctave=12)
    Scale.prototype.performKeyToDegree = function(degree, stepsPerOctave) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = 12;
        return $ary_performKeyToDegree.call(this._degrees, degree, stepsPerOctave);
    };
    
    // ## performNearestInList (degree)
    Scale.prototype.performNearestInList = function(degree) {
        return $ary_performNearestInList.call(this._degrees, degree);
    };
    
    // ## performNearestInScale (degree, stepsPerOctave=12)
    Scale.prototype.performNearestInScale = function(degree, stepsPerOctave) {
        if (typeof stepsPerOctave !== "number") stepsPerOctave = 12;
        return $ary_performNearestInScale.call(this._degrees, degree, stepsPerOctave);
    };
    
    // ## equals (argScale)
    Scale.prototype.equals = function(argScale) {
        return $ary_equals.call(this.degrees(), argScale.degrees()) &&
            this._tuning.equals(argScale._tuning);
    };
    
    // ## deepCopy ()
    Scale.prototype.deepCopy = function() {
        return new Scale(this._degrees.slice(0),
                         this._pitchesPerOctave,
                         this._tuning.deepCopy(),
                         this.name);
    };
    
    // ## Scale.choose (size=7, pitchesPerOctave=12)
    // Creates a random scale from the library, constrained by size and pitchesPerOctave if desired
    Scale.choose = function(size, pitchesPerOctave) {
        if (typeof size !== "number") size = 7;
        if (typeof pitchesPerOctave !== "number") pitchesPerOctave = 12;
        
        return ScaleInfo.choose(function(x) {
            return x._degrees.length === size &&
                x._pitchesPerOctave === pitchesPerOctave;
        });
    };
    
    // ## Scale.guessPPO (degrees:Array)
    Scale.guessPPO = function(degrees) {
        if (!Array.isArray(degrees)) {
            return 128;
        }
        var i, max = degrees[0] || 0;
        for (i = degrees.length; i--; ) {
            if (degrees[i] > max) {
                max = degrees[i];
            }
        }
        var etTypes = [53,24,19,12];
        for (i = etTypes.length; i--; ) {
            if (max < etTypes[i]) {
                return etTypes[i];
            }
        }
        return 128;
    };
    
    // # ScaleInfo
    var ScaleInfo = subcollider.ScaleInfo = {};
    var scales    = {};
    
    // ## ScaleInfo.choose (selectFunc)
    ScaleInfo.choose = function(selectFunc) {
        var candidates = [];
        var keys = Object.keys(scales);
        var s;
        for (var i = keys.length; i--; ) {
            s = scales[keys[i]];
            if (typeof selectFunc !== "function" || selectFunc(s)) {
                candidates.push(s);
            }
        }
        s = candidates[(Math.random() * candidates.length)|0];
        if (s) {
            return s.deepCopy();
        }
    };
    
    // ## ScaleInfo.at (key)
    ScaleInfo.at = function(key) {
        var s = scales[key];
        if (s) return s.deepCopy();
    };
    
    // ## ScaleInfo.names ()
    ScaleInfo.names = function() {
        var keys = Object.keys(scales);
        keys.sort();
        return keys;
    };
    
    // ## ScaleInfo.register (key, scale)
    ScaleInfo.register = function(key, scale) {
        if (typeof key === "string" && scale instanceof Scale) {
            scales[key] = scale;
            
            Scale[key] = (function(key) {
                return function(tuning) {
                    var scale = scales[key].deepCopy();
                    if (typeof tuning === "string") {
                        tuning = subcollider.TuningInfo.at(tuning);
                    }
                    if (tuning instanceof subcollider.Tuning) {
                        scale.tuning(tuning);
                    }
                    return scale;
                };
            }(key));
        }
    };
    
    
    // # Tuning
    // Represents a musical tuning (e.g. equal temperament, just intonation, etc...). Used in conjunction with *SC.Scale* to generate pitch information.
    // > /SC-Source/SCClassLibrary/Common/Collections/Scale.sc
    
    // ## Constructor
    function Tuning(tuning, octaveRatio, name) {
        if (!Array.isArray(tuning)) {
            tuning = [0,1,2,3,4,5,6,7,8,9,10,11];
        }
        if (typeof octaveRatio !== "number") {
            octaveRatio = 2;
        }
        if (typeof name !== "string") {
            name = "Unknown Tuning";
        }
        this._tuning      = tuning;
        this._octaveRatio = octaveRatio;
        this.name = name;
    }
    subcollider.Tuning = Tuning;
    
    
    // ## semitones ()
    // Returns an array of semitone values for the pitch set
    Tuning.prototype.semitones = function() {
        return this._tuning.slice(0);
    };
    
    // ## cents ()
    // Returns a array of cent values for the pitch set
    Tuning.prototype.cents = function() {
        return this._tuning.slice(0).map(function(x) {
            return x * 100;
        });
    };
    
    // ## ratios ()
    // Returns a tuned array of ratios for the pitch set
    Tuning.prototype.ratios = function() {
        return $ary_midiratio.call(this._tuning);
    };
    
    // ## at (index:int)
    Tuning.prototype.at = function(index) {
        return this._tuning[index];
    };
    
    // ## wrapAt (index:int)
    Tuning.prototype.wrapAt = function(index) {
        return $ary_wrapAt.call(this._tuning, index);
    };
    
    // ## octaveRatio ()
    Tuning.prototype.octaveRatio = function() {
        return this._octaveRatio;
    };
    
    // ## size ()
    Tuning.prototype.size = function() {
        return this._tuning.length;
    };
    
    // ## stepsPerOctave ()
    Tuning.prototype.stepsPerOctave = function() {
        return Math.log(this._octaveRatio) * Math.LOG2E * 12;
    };
    
    // ## tuning ()
    Tuning.prototype.tuning = function() {
        return this._tuning;
    };
    
    // ## equals (argTuning)
    Tuning.prototype.equals = function(argTuning) {
        return this._octaveRatio === argTuning._octaveRatio &&
            $ary_equals.call(this._tuning, argTuning._tuning);
    };
    
    // ## deepCopy ()
    Tuning.prototype.deepCopy = function() {
        return new Tuning(this._tuning.slice(0),
                          this._octaveRatio,
                          this.name);
    };
    
    // ## Tuning.et (pitchesPerOctave:12)
    // Creates an equal-tempered scale based on pitchesPerOctave
    Tuning.et = function(pitchesPerOctave) {
        if (typeof pitchesPerOctave !== "number") {
            pitchesPerOctave = 12;
        }
        return new Tuning(Tuning.calcET(pitchesPerOctave),
                          2,
                          Tuning.etName(pitchesPerOctave));
    };
    
    // ## Tuning.choose (size:12)
    // Creates a random tuning from the library, constrained by size (which defaults to 12)
    Tuning.choose = function(size) {
        if (typeof size !== "number") {
            size = 12;
        }
        return TuningInfo.choose(
            function(x) { return x.size() === size; }
        );
    };

    // ## Tuning.default (pitchesPerOctave)
    Tuning["default"] = function(pitchesPerOctave) {
        return Tuning.et(pitchesPerOctave);
    };
    
    // ## Tuning.calcET (pitchesPerOctave)
    Tuning.calcET = function(pitchesPerOctave) {
        var a = new Array(pitchesPerOctave);
        for (var i = a.length; i--; ) {
            a[i] = i * (12 / pitchesPerOctave);
        }
        return a;
    };
    
    // ## Tuning.etName (pitchesPerOctave)
    Tuning.etName = function(pitchesPerOctave) {
        return "ET" + pitchesPerOctave;
    };

    // # TuningInfo
    var TuningInfo = subcollider.TuningInfo = {};
    var tunings    = {};
    
    // ## TuningInfo.choose (selectFunc)
    TuningInfo.choose = function(selectFunc) {
        var candidates = [];
        var keys = Object.keys(tunings);
        var t;
        for (var i = keys.length; i--; ) {
            t = tunings[keys[i]];
            if (typeof selectFunc !== "function" || selectFunc(t)) {
                candidates.push(t);
            }
        }
        t = candidates[(Math.random() * candidates.length)|0];
        if (t) {
            return t.deepCopy();
        }
    };
    
    // ## TuningInfo.at (key)
    TuningInfo.at = function(key) {
        var t = tunings[key];
        if (t) {
            return t.deepCopy();
        }
    };
    
    // ## TuningInfo.names ()
    TuningInfo.names = function() {
        var keys = Object.keys(tunings);
        keys.sort();
        return keys;
    };
    
    // ## TuningInfo.register (key, tuning)
    TuningInfo.register = function(key, tuning) {
        if (typeof key === "string" && tuning instanceof Tuning) {
            tunings[key] = tuning;
            Tuning[key] = (function(key) {
                return function() {
                    return TuningInfo.at(key).deepCopy();
                };
            }(key));
        }
    };
    
    // # RGen
    function RGen(seed) {
        if (typeof seed !== "number") {
            seed = +new Date();
        }
        var hash = seed;
        hash += ~(hash <<  15);
        hash ^=   hash >>> 10;
        hash +=   hash <<  3;
        hash ^=   hash >>> 6;
        hash += ~(hash <<  11);
        hash ^=   hash >>> 16;
        
        this.s1 = 1243598713 ^ seed; if (this.s1 <  2) this.s1 = 1243598713;
        this.s2 = 3093459404 ^ seed; if (this.s2 <  8) this.s2 = 3093459404;
        this.s3 = 1821928721 ^ seed; if (this.s3 < 16) this.s3 = 1821928721;
    }
    
    RGen.prototype.trand = function() {
        this.s1 = ((this.s1 & 4294967294) << 12) ^ (((this.s1 << 13) ^  this.s1) >>> 19);
        this.s2 = ((this.s2 & 4294967288) <<  4) ^ (((this.s2 <<  2) ^  this.s2) >>> 25);
        this.s3 = ((this.s3 & 4294967280) << 17) ^ (((this.s3 <<  3) ^  this.s3) >>> 11);
        return this.s1 ^ this.s2 ^ this.s3;
    };
    
    var _i = new Uint32Array(1);
    var _f = new Float32Array(_i.buffer);
    
    // ## frand ()
	// return a number from 0.0 to 0.999...
    RGen.prototype.next = function() {
        _i[0] = 0x3F800000 | (this.trand() >>> 9);
        return _f[0] - 1;
    };
    
    subcollider.RGen = RGen;
    
    
    // ---
    
    ScaleInfo.register(
        "major", new Scale([0,2,4,5,7,9,11], 12, null, "Major")
    );
    ScaleInfo.register(
        "minor", new Scale([0,2,3,5,7,8,10], 12, null, "Natural Minor")
    );
    TuningInfo.register(
        "et12", new Tuning(([
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
        ]), 2, "ET12")
    );
    TuningInfo.register(
        "just", new Tuning($ary_ratiomidi.call([
            1, 16/15, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5, 5/3, 9/5, 15/8
        ]), 2, "Limit Just Intonation")
    );
    
    // ---
    
    // ##### utility functions
    function extend(child, parent) {
        for (var key in parent) {
            if (parent.hasOwnProperty(key)) {
                child[key] = parent[key];
            }
        }
        function Ctor() {
            this.constructor = child;
        }
        Ctor.prototype  = parent.prototype;
        child.prototype = new Ctor();
        child.__super__ = parent.prototype;
        return child;
    }
    
    function register(name, args_count, $num_func, $ary_func) {
        if ($ary_func === undefined) {
            $ary_func = function() {
                var args = [].slice.call(arguments);
                return this.map(function(x) {
                    return $num_func.apply(x, args);
                });
            };
        }
        if ($num_func !== NOP && $ary_func !== NOP) {
            switch (args_count) {
            case 0:
                subcollider[name] = function(obj) {
                    return (typeof obj === "number") ? $num_func.call(obj) :
                           (Array.isArray(obj))      ? $ary_func.call(obj) :
                           undefined;
                };
                break;
            case 1:
                subcollider[name] = function(obj, $1) {
                    return (typeof obj === "number") ? $num_func.call(obj, $1) :
                           (Array.isArray(obj))      ? $ary_func.call(obj, $1) :
                           undefined;
                };
                break;
            default:
                subcollider[name] = function(obj) {
                    var args = [].slice.call(arguments, 1);
                    return (typeof obj === "number") ? $num_func.apply(obj, args) :
                           (Array.isArray(obj))      ? $ary_func.apply(obj, args) :
                           undefined;
                };
                break;
            }
        } else if ($ary_func !== NOP) {
            switch (args_count) {
            case 0:
                subcollider[name] = function(ary) {
                    if (Array.isArray(ary))
                        return $ary_func.call(ary);
                };
                break;
            case 1:
                subcollider[name] = function(ary, $1) {
                    if (Array.isArray(ary))
                        return $ary_func.call(ary, $1);
                };
                break;
            default:
                subcollider[name] = function(ary) {
                    if (Array.isArray(ary))
                        return $ary_func.apply(ary, [].slice.call(arguments, 1));
                };
                break;
            }
        } else if ($num_func !== NOP) {
            switch (args_count) {
            case 0:
                subcollider[name] = function(num) {
                    if (typeof num === "number")
                        return $num_func.call(num);
                };
                break;
            case 1:
                subcollider[name] = function(num, $1) {
                    if (typeof num === "number")
                        return $num_func.call(num, $1);
                };
                break;
            default:
                subcollider[name] = function(num) {
                    if (typeof num === "number")
                        return $num_func.apply(num, [].slice.call(arguments, 1));
                };
                break;
            }
        }
        subcollider[name].use = function() {
            if (!$num[name] && $num_func) $num[name] = $num_func;
            if (!$ary[name] && $ary_func) $ary[name] = $ary_func;
        };
        subcollider[name].unuse = function() {
            delete $num[name];
            delete $ary[name];
        };
    }
    
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
