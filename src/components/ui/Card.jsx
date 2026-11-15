/**
 * @file components/ui/Card.jsx
 * @description Flexible surface container with optional padding and hover state.
 *
 * Sub-components: Card.Header, Card.Body, Card.Footer
 */

/**
 * @param {object} props
 * @param {'flat'|'raised'|'bordered'} [props.variant='bordered']
 * @param {'none'|'sm'|'md'|'lg'} [props.padding='md']
 * @param {boolean} [props.hoverable=false]
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export function Card({
  variant = 'bordered',
  padding = 'md',
  hoverable = false,
  className = '',
  children,
  ...props
}) {
  const VARIANTS = {
    flat:     'bg-surface',
    raised:   'bg-surface shadow-md',
    bordered: 'bg-surface border border-border shadow-sm',
  };

  const PADDING = {
    none: '',
    sm:   'p-4',
    md:   'p-6',
    lg:   'p-8',
  };

  return (
    <div
      className={[
        'rounded-xl',
        VARIANTS[variant] ?? VARIANTS.bordered,
        PADDING[padding] ?? PADDING.md,
        hoverable ? 'transition-shadow duration-200 hover:shadow-md cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
Card.Header = function CardHeader({ className = '', children, ...props }) {
  return (
    <div
      className={`flex items-center justify-between pb-4 mb-4 border-b border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
Card.Body = function CardBody({ className = '', children, ...props }) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

/**
 * @param {{ className?: string, children: React.ReactNode }} props
 */
Card.Footer = function CardFooter({ className = '', children, ...props }) {
  return (
    <div
      className={`flex items-center justify-between pt-4 mt-4 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
