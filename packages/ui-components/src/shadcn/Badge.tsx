import React from 'react';
import clsx from 'clsx';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'secondary' | 'default';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={clsx(
        'inline-block rounded bg-muted px-2 py-0.5 text-xs font-medium',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';
