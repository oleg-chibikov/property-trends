export default class HashingUtils {
  static hashCode = (s: string) => {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
      var character = s.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
}
