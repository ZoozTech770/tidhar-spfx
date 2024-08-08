import { useEffect, useState } from "react";

const getWindowDimensions = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isDesktopView = windowWidth >= 430;

  return {
    windowWidth,
    windowHeight,
    isDesktopView,
  };
};

type WindowDimentions = {
  windowWidth: number | undefined;
  windowHeight: number | undefined;
  isDesktopView: boolean | undefined;
};

const useWindowSizeListener = (): WindowDimentions => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>(
    getWindowDimensions()
  );
  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions(getWindowDimensions());
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowSizeListener;
