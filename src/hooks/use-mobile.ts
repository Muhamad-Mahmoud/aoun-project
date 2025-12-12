import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Hook to detect if the viewport is mobile size
 * Returns true if viewport width is less than MOBILE_BREAKPOINT (768px)
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Check initial value
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();

    // Listen to resize events
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
