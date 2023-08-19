import { getLocalStorage, setLocalStorage } from '@/libs/utils';
import { useEffect, useState } from 'react';

export const useLocalStorageItem = <T>(key: string, defaultValue: T) => {
  const [item, setItem] = useState<T | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setItem(getLocalStorage<T>(key));
    }
  }, [key]);
  useEffect(() => {
    if (typeof window !== 'undefined' && item !== undefined) {
      setLocalStorage(key, item);
    }
  }, [item, key]);

  return { item, setItem };
};
