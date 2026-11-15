/**
 * @file components/ui/Input.jsx
 * @description Accessible text input with optional label, helper text, and error state.
 */

import { useId } from 'react';

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} [props.helperText]
 * @param {string} [props.error]
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.leftIcon]
 * @param {React.ReactNode} [props.rightIcon]
 */
export function Input({
  label,
  helperText,
  error,
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  id: externalId,
  ...props
}) {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  const SIZE_CLASSES = {
    sm: 'h-8  text-sm  px-3',
    md: 'h-10 text-sm  px-3',
    lg: 'h-11 text-base px-4',
  };

  const inputBase =
    'w-full rounded-lg border bg-white text-text-primary placeholder:text-text-muted ' +
    'transition-colors duration-150 ' +
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-0 focus:border-primary-500 ' +
    'disabled:bg-secondary-50 disabled:text-text-disabled disabled:pointer-events-none';

  const borderClass = error
    ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
    : 'border-border hover:border-secondary-400';

  const paddingLeft  = leftIcon  ? 'pl-9'  : '';
  const paddingRight = rightIcon ? 'pr-9'  : '';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          className={[
            inputBase,
            borderClass,
            SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
            paddingLeft,
            paddingRight,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
            {rightIcon}
          </span>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-danger-500" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${id}-helper`} className="text-xs text-text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
