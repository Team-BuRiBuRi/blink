import { useState, useCallback } from 'react';

export default function usePostProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
  const [isError, setIsError] = useState<boolean | null>(null);

  const postProduct = useCallback(
    async (postProductRequestBody: PostProductRequestBody) => {
      setIsLoading(true);
      setIsSuccessful(null);
      setIsError(null);

      try {
        const response = await fetch(`/api/product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postProductRequestBody),
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
    postProduct,
  };
}
