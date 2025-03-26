import { useEffect, useState } from "react";

export function useSafeLocalStorage(
  key: string
): [string | null, (val: string) => void] {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      setValue(stored);
    }
  }, [key]);

  const updateValue = (val: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, val);
      setValue(val);
    }
  };

  return [value, updateValue];
}
