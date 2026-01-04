import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useLayoutEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < breakpoint);
      setIsLoading(false);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < breakpoint);
    setIsLoading(false);
    return () => mql.removeEventListener("change", onChange);
  }, [breakpoint]);

  return { isMobile: !!isMobile, isLoading };
}
