export default class StringUtils {
  static toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  static removeNonAlphaNumberic = (str: string) => str.replace(/\W/g, '_');

  static removePostfix = (str: string) => str.replace(/\..*/, '');

  static padPostCode = (postCode: number) => {
    const str = '' + postCode;
    const pad = '0000';
    return pad.substring(0, pad.length - str.length) + str;
  };

  static getSuburbId = (locality: string, postCode: number) => StringUtils.removeNonAlphaNumberic(locality).toLowerCase() + '_' + postCode;
}
