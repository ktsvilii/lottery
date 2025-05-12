import { FC, ReactNode, useEffect, useRef } from 'react';

interface ScrollableContainerProps {
  onScrollEnd?: () => void;
  className?: string;
  children: ReactNode;
}

export const ScrollableContainer: FC<ScrollableContainerProps> = ({ onScrollEnd, className = '', children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !onScrollEnd) return;

    const handleScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
      if (nearBottom) onScrollEnd();
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [onScrollEnd]);

  return (
    <div ref={containerRef} className={`overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};
