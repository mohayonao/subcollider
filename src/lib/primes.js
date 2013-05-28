(function(sc) {
  "use strict";

  // var NUMPRIMES = 6542;
  var PRIMEMAX  = 65521;
  var primesieve = new Uint8Array(PRIMEMAX);
  var primelist  = [2];
  (function() {
    var i, p, q;
    p = 3;
    while (p <= PRIMEMAX) {
      i = (p-1)>>1;
      if (!primesieve[i]) {
        primelist.push(p);
        q = p + p + p;
        while (q < PRIMEMAX) {
          primesieve[(q-1)>>1] = 1;
          q += p + p;
        }
      }
      p += 2;
    }
  })();

  sc.register("nthPrime", {
    Number: function() {
      return primelist[this|0];
    },
    Array: function() {
      return this.map(function(x) { return x.nthPrime(); });
    }
  });
  sc.register("prevPrime", {
    Number: function() {
      var i, p, lo = 0, hi = primelist.length;
      var num = this|0;
      while (hi >= lo) {
        i = (lo + hi) >> 1;
        p = primelist[i];
        if (num === p) { return primelist[i]; }
        if (num < p) {
          hi = i - 1;
        } else {
          lo = i + 1;
        }
      }
      return primelist[Math.max(0, Math.min(hi, primelist.length-1))];
    },
    Array: function() {
      return this.map(function(x) { return x.prevPrime(); });
    }
  });
  sc.register("nextPrime", {
    Number: function() {
      var i, p, lo = 0, hi = primelist.length;
      var num = this|0;
      while (hi >= lo) {
        i = (lo + hi) >> 1;
        p = primelist[i];
        if (num === p) { return primelist[i]; }
        if (num < p) {
          hi = i - 1;
        } else {
          lo = i + 1;
        }
      }
      return primelist[Math.max(0, Math.min(lo, primelist.length-1))];
    },
    Array: function() {
      return this.map(function(x) { return x.nextPrime(); });
    }
  });
  sc.register("isPrime", {
    Number: function() {
      return primelist.indexOf(this|0) !== -1;
    },
    Array: function() {
      return this.map(function(x) { return x.isPrime(); });
    }
  });
  sc.register("indexOfPrime", {
    Number: function() {
      return primelist.indexOf(this|0);
    },
    Array: function() {
      return this.map(function(x) { return x.indexOfPrime(); });
    }
  });

  sc.register("factors", {
    Number: function() {
      if (this <= 1) { return []; }
      var a = [];
      var num = this|0, prime;
      for (var i = 0, imax = primelist.length; i < imax; ++i) {
        prime = primelist[i];
        while (num % prime === 0) {
          a.push(prime);
          num /= prime;
          if (num === 1) { return a; }
        }
        if (Math.sqrt(prime) > num) {
          a.push(num);
          return a;
        }
      }
      a.push(num);
      return a;
    },
    Array: function() {
      return this.map(function(x) { return x.factors(); });
    }
  });

})(sc);
