export default class StringUtils {
  static toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  static removeNonAlphaNumberic = (str: string) => str.replace(/\W/g, '');
}
