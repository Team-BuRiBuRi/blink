import { format } from 'd3-format'

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

export const objectUrlToBlob = (objectUrl: string): Promise<Blob> => {
    return fetch(objectUrl).then((res) => res.blob());
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

export function formatMoney(money: number, currency: "USD" | "ARS" | "BTC"): string {
    return currency === "BTC" ? format(".5e")(money) : format(".4s")(money)
} 