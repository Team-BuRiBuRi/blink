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

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64String = event.target?.result as string;
      resolve(base64String);
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsDataURL(blob);
  });
}
