/** Shared easing curve — expo out, used across all scroll animations */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Factory for staggered reveal variants — eliminates boilerplate in section components */
export const staggerVariants = (
  from: { y?: number; x?: number; scale?: number },
  { stagger = 0.1, duration = 0.5 }: { stagger?: number; duration?: number } = {},
) => ({
  hidden: { opacity: 0, ...from },
  visible: (i: number) => ({
    opacity: 1,
    ...Object.fromEntries(Object.keys(from).map((k) => [k, k === "scale" ? 1 : 0])),
    transition: { delay: stagger * i, duration, ease: EASE_OUT_EXPO },
  }),
});
