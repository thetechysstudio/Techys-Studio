import { useEffect } from "react";

export const useScrollToTopOnReload = (): void => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
export const useScrollToTopOnReloadOnCLick = (): void => {
    window.scrollTo(0, 0);
};
