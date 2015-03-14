"use strict";

import sc from "./sc";
import * as number from "./number";
import * as array from "./array";
import config from "./config";
import SCRandom from "./random";

Object.keys(number).forEach((name) => {
  sc.addFunction(name, number[name], {
    category: "number", expandToArray: true
  });
});

Object.keys(array).forEach((name) => {
  sc.addFunction(name, array[name], {
    category: "array"
  });
});

sc.config = config;
sc.Random = SCRandom;

export default sc;
