import {useCallback} from "react";

type GetValueFunction<T> = () => T;
type SetValueFunction<T> = (value: T) => void;

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const getValue: GetValueFunction<T> = useCallback(() => {
    const value = localStorage.getItem(key)

    return value ? JSON.parse(value) : defaultValue;
  }, [key, defaultValue]);

  const setValue: SetValueFunction<T> = useCallback((value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key]);

  return {
    getValue,
    setValue,
  };
}