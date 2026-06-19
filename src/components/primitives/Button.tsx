import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  fullWidth = true,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = 'rounded-btn font-ui font-bold text-[15px] tracking-tight transition-colors duration-150';
  const sizing = fullWidth ? 'w-full px-5 py-[15px]' : 'inline-flex px-5 py-[15px]';

  const variantClass =
    variant === 'primary'
      ? disabled
        ? 'bg-surface-03 text-paper-mute cursor-not-allowed'
        : 'bg-paper text-bg-midnight hover:bg-paper-soft active:bg-paper-dim'
      : 'bg-transparent text-paper border border-hairline-strong hover:bg-surface-02';

  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(base, sizing, variantClass, className)}
      {...rest}
    >
      {children}
    </button>
  );
}
