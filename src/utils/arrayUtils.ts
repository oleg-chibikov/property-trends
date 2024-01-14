export default class ArrayUtils {
  static arrayToObject = (array: never[], keyField: string) =>
    array.reduce((obj, item) => {
      obj[item[keyField]] = item;
      return obj;
    }, {});

  static clear = (array: never[]) => array.splice(0, array.length);
}
