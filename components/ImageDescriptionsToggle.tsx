"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ef-show-desc";
const CLASS_NAME = "ef-show-desc";

/** Site-wide switch for the "Describe this image" panels, which are hidden by default (WO-EF-074).
 *  The choice is saved per browser; app/layout.tsx re-applies it before first paint. */
export function ImageDescriptionsToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(document.documentElement.classList.contains(CLASS_NAME));
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle(CLASS_NAME, next);
    try {
      if (next) localStorage.setItem(STORAGE_KEY, "1");
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <button type="button" aria-pressed={on} onClick={toggle} className={className}>
      {on ? "Hide image descriptions" : "Show image descriptions"}
    </button>
  );
}
