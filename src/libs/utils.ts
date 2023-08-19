export const anyToFloat = (a: any) => {
  const parsedA = parseFloat(a);
  if (isNaN(parsedA)) return -1;
  return parsedA;
};

export const getLocalStorage = <T>(key: string): T | undefined => {
  const item = localStorage.getItem(key);
  if (item === null) return;
  try {
    const parsedItem = JSON.parse(item) as T;
    return parsedItem;
  } catch (e) {
    return undefined;
  }
};

export const setLocalStorage = <T>(key: string, value: T) => {
  const stringifiedItem = JSON.stringify(value);
  localStorage.setItem(key, stringifiedItem);
};
