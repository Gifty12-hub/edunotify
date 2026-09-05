import { useCallback, useState } from "react";

interface ApiRequestState<T> {
  data: T | null;
  loading: boolean;
  isError: boolean;
  errMessage: string;
  isSuccess: boolean;
  successMessage: string;
}

function initialState<T>(): ApiRequestState<T> {
  return {
    data: null,
    loading: false,
    isError: false,
    errMessage: "",
    isSuccess: false,
    successMessage: "",
  };
}

/**
 * Generic custom hook for making an API request (real or, for now, mocked)
 * and tracking its full lifecycle — loading, error, and success — so
 * components don't repeat that bookkeeping in every form.
 *
 * Usage:
 *   const { loading, isError, errMessage, data, isSuccess, successMessage, request } =
 *     useApiRequest<AuthResponse>();
 *
 *   const handleSubmit = async () => {
 *     const result = await request(() => loginRequest(email, password), "Logged in!");
 *     if (result) { ... } // request() resolves the data on success, or null on failure
 *   };
 *
 * useCallback wraps `request` and `reset` so their function reference stays
 * stable across re-renders — this matters if a component ever puts them in
 * a useEffect dependency array, since a new function identity on every
 * render would otherwise re-trigger that effect unnecessarily.
 */
export function useApiRequest<T>() {
  const [state, setState] = useState<ApiRequestState<T>>(initialState<T>());

  const request = useCallback(async (apiCall: () => Promise<T>, successMessage = "Success") => {
    setState({ ...initialState<T>(), loading: true });
    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        isError: false,
        errMessage: "",
        isSuccess: true,
        successMessage,
      });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setState({
        data: null,
        loading: false,
        isError: true,
        errMessage: message,
        isSuccess: false,
        successMessage: "",
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => setState(initialState<T>()), []);

  return { ...state, request, reset };
}