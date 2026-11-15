/**
 * @file components/ui/Badge.jsx
 * @description Compact status/label indicator.
 *
 * Variants: default | primary | success | warning | danger | info
 * Sizes:    sm | md
 */

const VARIANTS = {
  default: 'bg-secondary-100 text-secondary-700',
  primary: 'bg-primary-100  text-primary-700',
  success: 'bg-green-100    text-green-700',
  warning: 'bg-yellow-100   text-yellow-700',
  danger:  'bg-red-100      text-red-700',
  info:    'bg-blue-100     text-blue-700',
};

const SIZES = {
  sm: 'px-2    py-0.5 text-xs',
  md: 'px-2.5  py-1   text-xs',
};

/**
 * @param {object} props
 * @param {'default'|'primary'|'success'|'warning'|'danger'|'info'} [props.variant='default']
 * @param {'sm'|'md'} [props.size='md']
 * @param {boolean} [props.dot=false] - Render a small status dot before the label
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Badge({
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
  children,
  ...props
}) {
  const DOT_COLOR = {
    default: 'bg-secondary-500',
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger:  'bg-red-500',
    info:    'bg-blue-500',
  };

  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        VARIANTS[variant] ?? VARIANTS.default,
        SIZES[size] ?? SIZES.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLOR[variant] ?? DOT_COLOR.default}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
