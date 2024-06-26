import { useState, useEffect } from "react";

type AsyncFunction = () => Promise<any>;

export const useAsync = <T = any>(asyncFunction: AsyncFunction, [deps]: any = []) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);
    const [data, setData] = useState<T | null>(null);

    const execute = async () => {
        setLoading(true);
        setError(null);
        setData(null);
        try {
            const response = await asyncFunction();
            setData(response?.data);
            return response;
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        execute();
    }, [deps]);

    return { loading, error, data };
};
