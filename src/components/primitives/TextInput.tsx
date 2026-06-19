import { clsx } from 'clsx';
import { useState, type InputHTMLAttributes } from 'react';

export type ValidationStatus = 'ok' | 'error' | 'info';

export interface Validation {
  status: ValidationStatus;
  message: string;
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  validation?: Validation;
  onValueChange?: (value: string) => void;
}

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
    </svg>
  );
}

export function TextInput({
  label,
  validation,
  value,
  type = 'text',
  placeholder,
  onValueChange,
  onChange,
  ...rest
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const hasError = validation?.status === 'error';
  const hasOk = validation?.status === 'ok';

  const borderColor = focused
    ? 'border-lamp'
    : hasError
      ? 'border-error'
      : hasOk
        ? 'border-ok'
        : 'border-hairline';

  const messageColor =
    validation?.status === 'ok'
      ? 'text-ok'
      : validation?.status === 'error'
        ? 'text-error'
        : 'text-paper-mute';

  return (
    <div className="mb-[18px]">
      <label className="block font-ui text-[12px] font-semibold text-paper-dim mb-2 tracking-tight">
        {label}
      </label>
      <div
        className={clsx(
          'flex items-center px-4 py-3 bg-surface-01 rounded-input transition-colors duration-150 border-[1.5px]',
          borderColor,
        )}
      >
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => {
            onValueChange?.(e.target.value);
            onChange?.(e);
          }}
          className="flex-1 bg-transparent outline-none font-ui text-[14.5px] text-paper placeholder:text-paper-mute tracking-tight"
          {...rest}
        />
        {hasOk && (
          <span className="text-ok ml-1.5 flex items-center">
            <CheckIcon size={15} />
          </span>
        )}
      </div>
      {validation?.message && (
        <div className={clsx('flex items-center gap-1 mt-1.5 font-ui text-[11.5px] font-medium', messageColor)}>
          {validation.status === 'ok' && <CheckIcon size={11} />}
          {validation.status === 'error' && <AlertIcon size={11} />}
          <span>{validation.message}</span>
        </div>
      )}
    </div>
  );
}
