import { KeyboardEvent } from 'react';

export const useKeyboardNavigation = (callback: () => void) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };
  return handleKeyDown;
}; 