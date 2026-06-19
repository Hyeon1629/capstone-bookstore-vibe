import { motion } from 'framer-motion';
import { TOKENS } from '@/lib/tokens';

const SPARKS = [
  { l: '12%', t: '18%', s: 8, d: 0 },
  { l: '82%', t: '22%', s: 10, d: 1.2 },
  { l: '20%', t: '78%', s: 7, d: 0.4 },
  { l: '78%', t: '76%', s: 9, d: 0.8 },
  { l: '50%', t: '10%', s: 6, d: 1.6 },
  { l: '8%', t: '48%', s: 5, d: 0.6 },
  { l: '90%', t: '52%', s: 6, d: 1.4 },
];

export function Sparkles() {
  return (
    <>
      {SPARKS.map((sp, i) => (
        <motion.svg
          key={i}
          width={sp.s}
          height={sp.s}
          viewBox="0 0 24 24"
          fill={TOKENS.color.accentLamp}
          className="absolute pointer-events-none z-[2]"
          style={{ left: sp.l, top: sp.t }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, delay: sp.d, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
        </motion.svg>
      ))}
    </>
  );
}
