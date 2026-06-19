import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/primitives';

interface LogoutDialogProps {
  open: boolean;
  busy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutDialog({ open, busy, onConfirm, onCancel }: LogoutDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onCancel}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.96, y: 12, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-xs bg-surface-01 border border-hairline-strong rounded-card p-6"
        style={{ boxShadow: 'var(--shadow-warm)' }}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="logout-dialog-title"
      >
        <h2
          id="logout-dialog-title"
          className="font-display text-[20px] font-bold text-paper tracking-[-0.3px]"
        >
          로그아웃 하시겠어요?
        </h2>
        <p className="mt-2 font-ui text-[12.5px] text-paper-dim leading-[1.65]">
          다음 진입 시 다시 이메일·비밀번호로 로그인해야 해요.
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 py-3 rounded-btn border border-hairline-strong text-paper font-ui text-[14px] font-semibold hover:bg-surface-02"
          >
            취소
          </button>
          <Button onClick={onConfirm} disabled={busy} fullWidth>
            {busy ? '로그아웃 중...' : '로그아웃'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
