import { useCallback, useEffect } from "react";

const useOnClickOutside = (ref: React.RefObject<HTMLElement>, callback: Function) => {
    const listener = useCallback((event: MouseEvent | TouchEvent) => {
        if(ref.current && !ref.current.contains(event.target as Node)) {
            callback(event);
        }
    }, [ref, callback]);

    useEffect(() => {
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, []);
};

export default useOnClickOutside;