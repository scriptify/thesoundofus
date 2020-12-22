interface AnimateValueParams {
  from: number;
  to: number;
  duration: number;
  onAnimate: (value: number) => void;
  onAnimationEnd?: (value: number) => void;
}

/**
 * Animate the properties
 * of an object. Both objects
 * are expected to have
 * the same properties.
 */
export function animateValue({
  to,
  from,
  duration,
  onAnimate,
  onAnimationEnd = () => {},
}: AnimateValueParams) {
  const diff = to - from;
  const animFactor = diff / duration;

  let start = 0;
  let cancelled = false;

  const animate = (timestamp: number = Date.now()) => {
    if (!start) {
      start = timestamp;
    }
    const elapsed = timestamp - start;
    let value = from + animFactor * elapsed;
    onAnimate(value);

    if (elapsed < duration && !cancelled) {
      setTimeout(() => animate(), 1000 / 60);
    } else {
      onAnimate(to);
      onAnimationEnd(to);
    }
  };

  animate();

  return () => {
    cancelled = true;
  };
}
