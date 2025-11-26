import { useEffect } from 'react';

export function useKeyboard(handlers, deps = []) {
  useEffect(() => {
    const handleKey = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const handler = handlers[e.key] || handlers[e.key.toLowerCase()];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, deps);
}
