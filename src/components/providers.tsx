"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Global client-side providers.
 * - Handles Zustand persistence hydration (avoids SSR hydration mismatch).
 * - Provides a lightweight toast/notification surface.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <>
      {children}
      {/* Hidden rehydration gate for persisted client stores */}
      <div ref={ref} className="hidden" aria-hidden data-hydrated={hydrated} />
    </>
  );
}
