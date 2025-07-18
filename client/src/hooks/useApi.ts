import { useState, useCallback } from "react";
import type { AxiosRequestConfig, AxiosError } from "axios";
import apiClient from "./apiClient";

interface ApiState<T> {
  data: T | null;
  error: AxiosError | null;
  loading: boolean;
}

export const useApi = <T>() => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  // Wrap the request function in useCallback to memoize it.
  // This ensures it's a stable dependency for useEffect hooks.
  const request = useCallback(async (config: AxiosRequestConfig) => {
    setState({
      data: null,
      error: null,
      loading: true,
    });
    try {
      const response = await apiClient.request<T>(config);
      setState({
        data: response.data,
        error: null,
        loading: false,
      });
    } catch (err) {
      setState({
        data: null,
        error: err as AxiosError,
        loading: false,
      });
    }
  }, []); // The dependency array is empty as the function is self-contained.

  return { ...state, request };
};
