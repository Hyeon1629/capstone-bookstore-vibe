import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  leftDot?: string;
  /** 좁은 너비에 여러 칩을 한 줄로 넣을 때 사용하는 압축 사이즈 */
  dense?: boolean;
  children: ReactNode;
}

export function Chip({ active = false, leftDot, dense = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center rounded-full whitespace-nowrap shrink-0',
        'font-ui transition-colors duration-150',
        dense ? 'gap-1 px-2 py-1.5 text-[11px]' : 'gap-1.5 px-3.5 py-2 text-[12.5px]',
        active
          ? 'bg-paper text-bg-midnight font-semibold border border-paper'
          : 'bg-surface-02 text-paper-dim font-medium border border-hairline hover:border-hairline-strong',
        className,
      )}
      {...rest}
    >
      {leftDot && (
        <span
          aria-hidden
          className={clsx('inline-block rounded-full', dense ? 'w-[6px] h-[6px]' : 'w-[7px] h-[7px]')}
          style={{ background: leftDot }}
        />
      )}
      {children}
    </button>
  );
}
