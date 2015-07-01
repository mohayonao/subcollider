import * as array from "./array";
import * as number from "./number";
import tunings from "./data/tuning";

export default class SCTuning {
  constructor(tuning, octaveRatio, name) {
    if (!Array.isArray(tuning)) {
      tuning = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    }

    if (typeof octaveRatio !== "number") {
      octaveRatio = 2;
    }

    if (typeof name !== "string") {
      name = "Unknown Tuning";
    }

    this._tuning = tuning;
    this._octaveRatio = octaveRatio;

    this.name = name;
  }

  static at(key) {
    if (tunings.hasOwnProperty(key)) {
      let { tuning, octaveRatio, name } = tunings[key];

      return new SCTuning(tuning, octaveRatio, name);
    }

    return null;
  }

  static et(pitchesPerOctave) {
    if (typeof pitchesPerOctave !== "number") {
      pitchesPerOctave = 12;
    }
    pitchesPerOctave |= 0;

    return new SCTuning(calcET(pitchesPerOctave), 2, "ET" + pitchesPerOctave);
  }

  get tuning() {
    return this._tuning;
  }

  get length() {
    return this._tuning.length;
  }

  octaveRatio() {
    return this._octaveRatio;
  }

  stepsPerOctave() {
    return Math.log(this.octaveRatio()) * Math.LOG2E * 12;
  }

  semitones() {
    return this._tunings.slice();
  }

  cents() {
    return this.semitones().map(x => x * 100);
  }

  ratios() {
    return this.semitones().map(x => number.midiratio(x));
  }

  at(index) {
    return array.at(this._tuning, index);
  }

  wrapAt(index) {
    return array.wrapAt(this._tuning, index);
  }

  clone() {
    return new SCTuning(this._tuning.slice(0), this._octaveRatio, this.name);
  }
}

export function calcET(pitchesPerOctave) {
  let result = new Array(pitchesPerOctave);

  for (let i = 0; i < pitchesPerOctave; i++) {
    result[i] = i * (12 / pitchesPerOctave);
  }

  return result;
}
