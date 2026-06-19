import { motion } from 'framer-motion';

export function PaperFadeOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none"
      style={{ background: 'var(--paper)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.85, 0] }}
      transition={{ duration: 0.6, times: [0, 0.5, 1], ease: 'easeOut' }}
    />
  );
}
