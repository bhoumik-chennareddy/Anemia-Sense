import React, { ReactNode, forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  asChild?: boolean;
  children?: ReactNode;
  className?: string;
}

interface ChildProps {
  className?: string;
  [key: string]: any;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', asChild = false, children, ...props }, ref) => {
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variantStyles = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      outline: 'border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700',
    };

    if (asChild && React.Children.count(children) === 1) {
      const child = React.Children.only(children) as React.ReactElement<ChildProps>;
      return React.cloneElement(child, {
        className: `${baseStyles} ${variantStyles[variant]} ${child.props.className || ''}`.trim(),
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
