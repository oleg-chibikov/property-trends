export default class StringUtils {
  static toTitleCase = (phrase: string) => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  static removeWhitespace = (str: string) => str.replace(/[\s'"]/g, '-');
}
