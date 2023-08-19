import { useState, useCallback } from 'react';

export default function usePatchProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
  const [isError, setIsError] = useState<boolean | null>(null);

  const patchProduct = useCallback(
    async (patchProductRequestBody: PatchProductRequestBody) => {
      setIsLoading(true);
      setIsSuccessful(null);
      setIsError(null);

      try {
        const response = await fetch(`/api/Product`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(patchProductRequestBody),
        });

        setIsLoading(false);

        if (response.ok) {
          setIsSuccessful(true);
          setIsError(false);
          return true;
        } else {
          setIsSuccessful(false);
          setIsError(true);
          return false;
        }
      } catch (err) {
        setIsSuccessful(false);
        setIsLoading(false);
        setIsError(true);
        return false;
      }
    },
    []
  );

  return {
    isLoading,
    isSuccessful,
    isError,
    patchProduct,
  };
}
