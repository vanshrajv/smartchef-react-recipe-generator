import { useEffect, useState } from "react";
export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        try { const stored = JSON.parse(localStorage.getItem(key)); return stored === null ? initialValue : stored; } catch { return initialValue; }
    });
    useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
    return [value, setValue];
}