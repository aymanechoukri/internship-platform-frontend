/**
 * @file components/ui/Button.jsx
 * @description Accessible, multi-variant button component.
 *
 * Variants: primary | secondary | outline | ghost | danger
 * Sizes:    sm | md | lg
 */

const BASE =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg ' +
  'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
  'disabled:opacity-50 disabled:pointer-events-none select-none';

const VARIANTS = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  secondary:
    'bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:bg-secondary-300',
  outline:
    'border border-border bg-transparent text-secondary-700 hover:bg-secondary-50 active:bg-secondary-100',
  ghost:
    'bg-transparent text-secondary-600 hover:bg-secondary-100 active:bg-secondary-200',
  danger:
    'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-600 shadow-sm',
};

const SIZES = {
  sm: 'h-8  px-3   text-sm',
  md: 'h-10 px-4   text-sm',
  lg: 'h-11 px-5   text-base',
};

/**
 * @param {object} props
 * @param {'primary'|'secondary'|'outline'|'ghost'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {boolean} [props.isLoading=false]
 * @param {boolean} [props.fullWidth=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={[
        BASE,
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
