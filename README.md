# subcollider.js <sup>v0.1.1</sup>

SubCollider.js is a JavaScript library that provides like SuperCollider functions to built-in prototypes and **sc** namespace. It is the recommended base library for [timbre.js](http://mohayonao.github.io/timbre.js/).

## Download

* [subcollider.js](https://raw.github.com/mohayonao/subcollider.js/master/builds/subcollider.js)
* [subcollider-min.js](https://raw.github.com/mohayonao/subcollider.js/master/builds/subcollider-min.js)
* [soucemap](https://raw.github.com/mohayonao/subcollider.js/master/builds/subcollider-min.map)

## Documents

[documents](http://mohayonao.github.com/subcollider/docs/)

## Installation

In browsers:

```html
<script src="subcollider.js"></script>
```

Using [npm](http://npmjs.org/):

```bash
npm install subcollider
```

## Examples

```js
 sc.midicps(69);
 // => 440

 sc.midicps([69, 71]);
 // => [ 440, 493.8833012561241 ]

 (4).ampdb();
 // => 12.041199826559248

 [4, 16].ampdb();
 // => [ 12.041199826559248, 24.082399653118497 ]

 sc.Range("0..5");
 // [ 0, 1, 2, 3, 4, 5 ]

 sc.Range("1...50").select("isPrime");
 // => [ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47 ]

 sc.Scale.major().degreeToFreq(sc.Range(7), 440).asInteger();
 // => [ 440, 493, 554, 587, 659, 739, 830, 880 ]

 sc.Scale.major("just").degreeToFreq(sc.Range(7), 440).asInteger();
 // => [ 440, 495, 550, 586, 660, 733, 824, 880 ]

 sc.Scale.minor("just").degreeToFreq(sc.Range(7), 440).asInteger();
 // => [ 440, 495, 528, 586, 660, 704, 792, 880 ]
```
