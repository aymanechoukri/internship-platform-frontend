/**
 * @file components/ui/Avatar.jsx
 * @description User avatar — displays an image, or falls back to initials,
 * then to a generic icon.
 *
 * Sizes: xs | sm | md | lg | xl
 */

const SIZES = {
  xs: 'w-6  h-6  text-xs',
  sm: 'w-8  h-8  text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

/**
 * Extract up to 2 initials from a full name string.
 * @param {string} name
 * @returns {string}
 */
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * @param {object} props
 * @param {string} [props.src]       - Image URL
 * @param {string} [props.alt]       - Alt text for the image
 * @param {string} [props.name]      - Full name (used to generate initials)
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {string} [props.className]
 */
export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  ...props
}) {
  const sizeClass = SIZES[size] ?? SIZES.md;
  const initials  = getInitials(name);

  const base =
    'inline-flex items-center justify-center rounded-full overflow-hidden ' +
    'bg-primary-100 text-primary-700 font-semibold shrink-0 select-none';

  if (src) {
    return (
      <img
        src={src}
        alt={alt ?? name ?? 'Avatar'}
        className={[sizeClass, 'rounded-full object-cover shrink-0', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    );
  }

  if (initials) {
    return (
      <span
        className={[base, sizeClass, className].filter(Boolean).join(' ')}
        aria-label={name}
        role="img"
        {...props}
      >
        {initials}
      </span>
    );
  }

  /* Generic person icon fallback */
  return (
    <span
      className={[base, sizeClass, 'bg-secondary-100 text-secondary-500', className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Anonymous user"
      role="img"
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-1/2 h-1/2"
        aria-hidden="true"
      >
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4Z" />
      </svg>
    </span>
  );
}
