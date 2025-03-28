export function getKeyFromValue<T extends object>(
  enumObj: T,
  value: T[keyof T],
): keyof T {
  if (!getKeyFromValue.cache.has(enumObj)) {
    const map = new Map(
      Object.entries(enumObj).map(([key, val]) => [val, key]),
    );
    getKeyFromValue.cache.set(enumObj, map);
  }

  const enumMap = getKeyFromValue.cache.get(enumObj)!;
  return enumMap.get(value) as keyof T;
}

getKeyFromValue.cache = new WeakMap<object, Map<any, string>>();
