import { useEffect } from "react";

export function useScrollToTop(options?: { behavior?: ScrollBehavior }) {
  useEffect(() => {
    // Scroll to the top when the component mounts (i.e., on page change)
    window.scrollTo({ top: 0, left: 0, behavior: options?.behavior ?? 'auto' });
  }, []);
}

