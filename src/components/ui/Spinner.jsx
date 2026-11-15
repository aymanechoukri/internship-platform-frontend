/**
 * @file components/ui/Spinner.jsx
 * @description Accessible loading spinner.
 *
 * Sizes:  sm | md | lg | xl
 * Colors: inherit from current text color by default, or override with className.
 */

const SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

/**
 * @param {object} props
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {string} [props.label='Loading…']
 * @param {string} [props.className]
 */
export function Spinner({
  size = 'md',
  label = 'Loading…',
  className = '',
  ...props
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center justify-center ${className}`}
      {...props}
    >
      <svg
        className={[
          'animate-spin text-primary-600',
          SIZES[size] ?? SIZES.md,
        ].join(' ')}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
