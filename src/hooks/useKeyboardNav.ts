import { useState, useCallback, useEffect, type RefObject } from "react";

type UseKeyboardNavOptions = {
  itemCount: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  isOpen: boolean;
  containerRef?: RefObject<HTMLElement | null>;
};

export function useKeyboardNav({
  itemCount,
  onSelect,
  onClose,
  isOpen,
}: UseKeyboardNavOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Reset active index when dropdown closes or item count changes
  useEffect(() => {
    if (!isOpen) setActiveIndex(-1);
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [itemCount]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % itemCount);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev <= 0 ? itemCount - 1 : prev - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0) {
            onSelect(activeIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "Tab":
          onClose();
          break;
      }
    },
    [isOpen, itemCount, activeIndex, onSelect, onClose],
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
}
