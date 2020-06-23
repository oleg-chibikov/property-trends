export default class HashingUtils {
  static hashCode = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const character = s.charCodeAt(i);
      hash = (hash << 5) - hash + character;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
}
