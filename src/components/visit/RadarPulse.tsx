import { motion } from 'framer-motion';
import { TOKENS } from '@/lib/tokens';

export function RadarPulse() {
  const rings = [0, 0.6, 1.2];
  return (
    <motion.div
      className="fixed inset-0 z-[50] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(122,165,196,0.18), transparent 60%)',
        }}
      />
      <div className="relative w-32 h-32">
        {rings.map((delay, i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: TOKENS.color.info }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 1.4,
              delay,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
        <div
          className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full"
          style={{ background: TOKENS.color.info, boxShadow: `0 0 18px ${TOKENS.color.info}` }}
        />
      </div>
      <div className="absolute bottom-1/3 font-mono text-[11px] text-paper tracking-[2.5px] uppercase">
        방문 감지 중
      </div>
    </motion.div>
  );
}
