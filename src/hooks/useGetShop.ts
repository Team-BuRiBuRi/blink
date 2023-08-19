import { useState, useCallback } from 'react';

export default function useGetShop() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
  const [isError, setIsError] = useState<boolean | null>(null);

  const getShop = useCallback(
    async (
      getShopRequestQuery: GetShopRequestQuery
    ): Promise<GetShopResponse | null> => {
      setIsLoading(true);
      setIsSuccessful(null);
      setIsError(null);

      try {
        const response = await fetch(`/api/shop?id=${getShopRequestQuery.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setIsLoading(false);

        if (response.ok) {
          setIsSuccessful(true);
          setIsError(false);
          return response.json();
        } else {
          setIsSuccessful(false);
          setIsError(true);
          return null;
        }
      } catch (err) {
        setIsSuccessful(false);
        setIsLoading(false);
        setIsError(true);
        return null;
      }
    },
    []
  );

  return {
    isLoading,
    isSuccessful,
    isError,
    getShop,
  };
}
