interface DotGridProps {
  dotSize?: number;
  gap?: number;
  opacity?: number;
  className?: string;
}

export const DotGrid = ({
  dotSize = 1,
  gap = 24,
  opacity = 0.12,
  className = "",
}: DotGridProps) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `radial-gradient(circle, var(--border-light) ${dotSize}px, transparent ${dotSize}px)`,
      backgroundSize: `${gap}px ${gap}px`,
      opacity,
    }}
  />
);
