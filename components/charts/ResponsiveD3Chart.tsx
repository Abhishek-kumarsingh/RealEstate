'use client';

import { useState, useEffect, useRef } from 'react';

interface ResponsiveD3ChartProps {
  children: (dimensions: { width: number; height: number }) => React.ReactNode;
  aspectRatio?: number;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export default function ResponsiveD3Chart({
  children,
  aspectRatio = 16 / 9,
  minHeight = 300,
  maxHeight = 500,
  className = ''
}: ResponsiveD3ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let height = containerWidth / aspectRatio;

        // Constrain height within min/max bounds
        height = Math.max(minHeight, Math.min(maxHeight, height));

        setDimensions({
          width: containerWidth,
          height: height
        });
      }
    };

    // Initial measurement
    updateDimensions();

    // Set up resize observer
    const resizeObserver = new ResizeObserver(() => {
      // Debounce the update to avoid too many re-renders
      setTimeout(updateDimensions, 50);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Listen for window resize events (including sidebar toggle)
    const handleResize = () => {
      setTimeout(updateDimensions, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [aspectRatio, minHeight, maxHeight]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {children(dimensions)}
    </div>
  );
}
