export default class MoneyUtils {
  static formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
  });

  static format = (num: number) => {
    return MoneyUtils.formatter.format(num);
  };
}
