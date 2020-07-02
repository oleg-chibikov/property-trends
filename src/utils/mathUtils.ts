export default class MathUtils {
  static linearToSimmetric = (linearValue: number, min: number, max: number, func: (v: number, mi: number, ma: number) => number) => {
    const middle = (min + max) / 2;
    const linearMiddle = 0.5;
    if (linearValue === linearMiddle) {
      return middle;
    }
    if (linearValue > linearMiddle) {
      return func(linearValue, middle, max);
    }
    const diffWithMiddle = linearMiddle - linearValue;
    const mirroredLinearValue = linearMiddle + diffWithMiddle;
    const mirroredLogarithmicValue = func(mirroredLinearValue, middle, max);
    const logDiffWithMiddle = mirroredLogarithmicValue - middle;
    return middle - logDiffWithMiddle;
  };

  static linearToLogarithmic = (linearValue: number, min: number, max: number) => {
    let value = Math.round(Math.pow(max - min + 1, linearValue) + min - 1);

    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }

    return value;
  };

  static linearToQuadratic = (linearValue: number, min: number, max: number) => {
    const x = min;
    const y = (min + max) / 2;
    const z = max;

    const c = x;
    const b = (2 * y - 2.5 * c - z / 2) / 1.5;
    const a = z - b - c;

    return a * linearValue * linearValue + b * linearValue + c;
  };

  static linearToLinear = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

  static closestMinimal = (needle: number, haystack: number[]) => {
    let i = 0;
    while (haystack[++i] < needle);
    return haystack[--i];
  };

  static interpolateLinear = (x1: number, x2: number, y1: number, y2: number) => {
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;

    return (x: number) => m * x + b;
  };
}
