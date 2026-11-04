/**
 * Helpers that keep PowerCurve operations linear. They reproduce exactly what the
 * original code did with `JSON.parse(JSON.stringify(...))`, `filter(...)[0]` and
 * `find(...)`: same values, same element picked when keys repeat and, for malformed
 * input, an error thrown at the same point.
 *
 * Only ES2015 features (Map, Object.keys) so the output stays valid for every
 * consumer: Node 16 back-ends and the es5/ES2020 front-end builds.
 */

/**
 * Same result as `JSON.parse(JSON.stringify(valuesList))` for the plain hour -> number
 * objects of a curve, without serializing to a string. JSON turns NaN and Infinity into
 * null and -0 into 0, and drops undefined values: the copy does the same. Anything less
 * usual (nested objects, toJSON, a "__proto__" key, missing values) goes through JSON.
 */
export function cloneValuesList(valuesList: any): any {
  if (
    valuesList === null ||
    typeof valuesList !== "object" ||
    Array.isArray(valuesList) ||
    typeof valuesList.toJSON === "function"
  ) {
    return JSON.parse(JSON.stringify(valuesList));
  }
  const copy: Record<string, any> = {};
  const keys = Object.keys(valuesList);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = valuesList[key];
    if (key === "__proto__") return JSON.parse(JSON.stringify(valuesList));
    if (typeof value === "number") {
      copy[key] = isFinite(value) ? (value === 0 ? 0 : value) : null;
    } else if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean"
    ) {
      copy[key] = value;
    } else if (
      value === undefined ||
      typeof value === "function" ||
      typeof value === "symbol"
    ) {
      continue;
    } else {
      return JSON.parse(JSON.stringify(valuesList));
    }
  }
  return copy;
}

/**
 * Replaces `items.filter((item) => keyOf(item) === key)[0]` repeated for many keys.
 * Like `filter`, the first lookup reads every item, so an item that makes `keyOf`
 * throw fails on that first lookup, as the filter did. The first item of each key wins.
 */
export class FirstByKey<T> {
  private index?: Map<any, T>;

  constructor(private items: T[], private keyOf: (item: T) => any) {}

  get(key: any): T | undefined {
    if (!this.index) {
      const index = new Map<any, T>();
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const itemKey = this.keyOf(item);
        if (!index.has(itemKey)) index.set(itemKey, item);
      }
      this.index = index;
    }
    return this.index.get(key);
  }
}

/**
 * Replaces `items.find((item) => keyOf(item) === key)` repeated for many keys. Items are
 * read in order and only as far as needed, so the item found and the point where a
 * malformed item throws are the same as with `find`.
 */
export class FirstByKeyInOrder<T> {
  private index = new Map<any, T>();
  private scanned = 0;

  constructor(private items: T[], private keyOf: (item: T) => any) {}

  get(key: any): T | undefined {
    if (this.index.has(key)) return this.index.get(key);
    while (this.scanned < this.items.length) {
      const item = this.items[this.scanned++];
      const itemKey = this.keyOf(item);
      if (!this.index.has(itemKey)) this.index.set(itemKey, item);
      if (itemKey === key) return item;
    }
    return undefined;
  }
}
