/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

export function findEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value: string,
): keyof T | undefined {
  return Object.entries(enumObj).find(([_, v]) => v === value)?.[0] as
    | keyof T
    | undefined;
}

type Constructor<T = object> = new (...args: any[]) => T;

export function Mix<TBase extends Constructor, TMixin extends Constructor>(
  Base: TBase,
  MixinClass: TMixin,
) {
  return class extends Base {
    constructor(...args: any[]) {
      super(...args);
      Object.assign(this, new MixinClass(...args));
    }
  };
}
