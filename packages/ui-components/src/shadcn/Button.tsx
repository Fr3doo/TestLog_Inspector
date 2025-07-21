import React from 'react';
import clsx from 'clsx';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    const classes = clsx(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-muted text-foreground hover:bg-muted/80',
        ghost: 'bg-transparent hover:bg-accent',
      }[variant],
      {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
      }[size],
      className
    );
    return <button ref={ref} className={classes} {...props} />;
  }
);
Button.displayName = 'Button';
