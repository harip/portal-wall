// Portal animation variants
export const portalAnimations = {
  initial: {
    opacity: 0,
    scale: 0.3,
    filter: 'blur(20px)',
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    filter: 'blur(20px)',
  },
};

export const portalTransition = {
  duration: 0.5,
  ease: [0.4, 0.0, 0.2, 1],
};
