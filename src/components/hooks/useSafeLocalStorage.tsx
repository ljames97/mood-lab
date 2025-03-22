import { useEffect, useState } from "react";

export function useSafeLocalStorage(key: string): string | null {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      setValue(stored);
    }
  }, [key]);

  return value;
}