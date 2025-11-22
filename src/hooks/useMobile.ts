import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      setIsLoading(false);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    setIsLoading(false);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return { isMobile: !!isMobile, isLoading };
}
