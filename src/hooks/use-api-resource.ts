"use client";

import { useEffect, useRef, useState } from "react";

interface ResourceResult<T> {
  key: string;
  data: T | null;
  error: unknown;
}

/**
 * A small data-loading helper for pages that read from the API.
 *
 * - `loader` is the API function, e.g. () => getServices({ page: 1 }).
 * - `reloadKey` tells the hook when to fetch again (filters, page, retry).
 *
 * Loading is derived from the request key instead of being set synchronously
 * inside the effect. That keeps the hook compatible with the React Compiler
 * and avoids cascading renders.
 */
export function useApiResource<T>(
  loader: () => Promise<T>,
  reloadKey: string | number = "",
) {
  const [reloadCount, setReloadCount] = useState(0);
  const requestKey = `${String(reloadKey)}::${reloadCount}`;

  const [result, setResult] = useState<ResourceResult<T>>({
    key: "",
    data: null,
    error: null,
  });

  // Keep the newest loader without forcing the effect to re-run on every render.
  const loaderRef = useRef(loader);

  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let isCancelled = false;

    Promise.resolve()
      .then(() => loaderRef.current())
      .then((data) => {
        if (isCancelled) return;
        setResult({ key: requestKey, data, error: null });
      })
      .catch((caughtError: unknown) => {
        if (isCancelled) return;
        setResult({ key: requestKey, data: null, error: caughtError });
      });

    return () => {
      isCancelled = true;
    };
  }, [requestKey]);

  const isCurrent = result.key === requestKey;

  return {
    data: isCurrent ? result.data : null,
    error: isCurrent ? result.error : null,
    isLoading: !isCurrent,
    reload: () => setReloadCount((count) => count + 1),
  };
}
