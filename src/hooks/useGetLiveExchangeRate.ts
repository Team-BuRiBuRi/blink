
import { useState, useCallback } from 'react';

interface Header {
    from: "USD";
    to: "BTC" | "ARS";
    start: string;
    end: string;
};

export default function useGetLiveExchangeRate() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessful, setIsSuccessful] = useState<boolean | null>(null);
    const [isError, setIsError] = useState<boolean | null>(null);

    const getLiveExchangeRate =
        useCallback(async (header: Header): Promise<XEAPIResponse | null> => {
            setIsLoading(true);
            setIsSuccessful(null);
            setIsError(null);
            try {
                const response = await fetch(
                    `https://xecdapi.xe.com/v1/historic_rate/period?from=${header.from}&to=${header.to}&start_timestamp=${header.start}&end_timestamp=${header.end}&crypto=${header.to === "BTC" ? true : false}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Basic ${btoa(
                                `${process.env.XE_ID}:${process.env.XE_KEY}`
                            )}`,
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
        }, []);

    return {
        isLoading,
        isSuccessful,
        isError,
        getLiveExchangeRate,
    };
}
