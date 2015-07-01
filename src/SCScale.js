import SCTuning from "./SCTuning";
import * as array from "./array";
import * as number from "./number";
import * as utils from "./utils";

export default class SCScale {
  constructor(degrees, pitchesPerOctave, tuning, name) {
    if (!Array.isArray(degrees)) {
       // ionian
      degrees = [ 0, 2, 4, 5, 7, 9, 11 ];
    }
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = guessPPO(degrees);
    }

    let _name;

    if (typeof tuning === "string") {
      _name = tuning;
      tuning = SCTuning.at(tuning);
    }
    if (!(tuning instanceof SCTuning)) {
      tuning = SCTuning.et(pitchesPerOctave);
    }
    if (typeof name === "undefined") {
      name = _name;
    }
    if (typeof name !== "string") {
      name = "Unknown Scale";
    }

    this._degrees = degrees;
    this._pitchesPerOctave = pitchesPerOctave;

    this.name = name;
    this.tuning = tuning;
  }

  get tuning() {
    return this._tuning;
  }

  set tuning(value) {
    if (typeof value === "string") {
      value = SCTuning.at(value);
    }

    if (!(value instanceof SCTuning)) {
      return;
    }

    if (this._pitchesPerOctave !== value.length) {
      return;
    }

    this._tuning = value;
  }

  get length() {
    return this._degrees.length;
  }

  degrees() {
    return this._degrees.slice();
  }

  pitchesPerOctave() {
    return this._pitchesPerOctave;
  }

  octaveRatio() {
    return this._tuning.octaveRatio();
  }

  stepsPerOctave() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  }

  semitones() {
    return this._degrees.map(i => array.wrapAt(this._tuning, i));
  }

  cents() {
    return this.semitones().map(x => x * 100);
  }

  ratios() {
    return this.semitones().map(x => number.midiratio(x));
  }

  at(index) {
    return this._tuning.at(array.wrapAt(this._degrees, index));
  }

  wrapAt(index) {
    return this._tuning.wrapAt(array.wrapAt(this._degrees, index));
  }

  degreeToFreq(degree, rootFreq, octave) {
    return this.degreeToRatio(degree, octave) * rootFreq;
  }

  degreeToRatio(degree, octave) {
    octave = utils.defaults(octave, 0);
    octave += (degree / this._degree.length)|0;

    return array.wrapAt(this.ratios()) * Math.pow(this.octaveRatio(), octave);
  }

  clone() {
    return new SCScale(this._degrees.slice(), this._pitchesPerOctave, this._tuning.clone(), this.name);
  }
}

export function guessPPO(degrees) {
  if (!Array.isArray(degrees)) {
    return 128;
  }

  let max = degrees[0] || 0;

  // TODO: REWRITE
  for (let i = degrees.length; i--; i += 0) {
    if (degrees[i] > max) {
      max = degrees[i];
    }
  }

  let etTypes = [ 53, 24, 19, 12 ];

  // TODO: REWRITE
  for (let i = etTypes.length; i--; i += 0) {
    if (max < etTypes[i]) {
      return etTypes[i];
    }
  }

  return 128;
}
