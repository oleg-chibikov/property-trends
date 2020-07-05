export default class MoneyUtils {
  static formatter = new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  static format = (value: number) => {
    const postfix = value > 1000 ? 'k' : '';
    if (value > 1000) {
      value = Math.round(value / 1000);
    }
    return MoneyUtils.formatter.format(value) + postfix;
  };
}
