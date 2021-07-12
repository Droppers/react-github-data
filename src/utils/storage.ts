/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const hasLocalStorage = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const mapToObject = (map: Map<any, any>) => {
  const object = {};
  map.forEach(function (value, key) {
    object[key] = value;
  });
  return object;
};

export const removeData = (key: string): boolean => {
  if (!hasLocalStorage()) return false;
  window.localStorage.removeItem(key);
  return true;
};

export const saveData = (key: string, data: any): boolean => {
  if (!hasLocalStorage()) return false;

  if (data instanceof Map) {
    data = mapToObject(data);
  }

  window.localStorage.setItem(key, JSON.stringify(data));
  return true;
};

export const loadData = <T>(
  key: string,
  ctor?: new (...a: any) => T
): T | null => {
  if (!hasLocalStorage()) return null;

  const item = window.localStorage.getItem(key);
  if (item === null) return null;

  try {
    if (ctor && ctor.name === "Map") {
      const map = new Map(Object.entries(JSON.parse(item))) as unknown;
      return map as T;
    }
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
};
