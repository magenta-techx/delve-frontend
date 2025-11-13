import { useState, useCallback } from 'react';

interface UseBooleanStateControlReturn {
  state: boolean;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
  setState: (value: boolean) => void;
}

export function useBooleanStateControl(initialValue: boolean = false): UseBooleanStateControlReturn {
  const [state, setState] = useState<boolean>(initialValue);

  const setTrue = useCallback(() => {
    setState(true);
  }, []);

  const setFalse = useCallback(() => {
    setState(false);
  }, []);

  const toggle = useCallback(() => {
    setState(prev => !prev);
  }, []);

  return {
    state,
    setTrue,
    setFalse,
    toggle,
    setState
  };
}