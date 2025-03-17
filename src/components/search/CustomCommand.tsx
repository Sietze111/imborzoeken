import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';

interface CustomCommandInputProps {
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export const CustomCommandInput = ({
  placeholder,
  value,
  onValueChange,
  className,
  autoFocus,
}: CustomCommandInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={`w-full p-2 focus:outline-none ${className}`}
      autoFocus={autoFocus}
    />
  );
};

export const CustomCommandItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onSelect?: () => void }
>(({ className, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    onClick={onSelect}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
));
CustomCommandItem.displayName = 'CustomCommandItem';

export const CustomCommandEmpty = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="py-6 text-center text-sm text-muted-foreground">
    {children}
  </div>
);

export const CustomCommandList = ({
  children,
}: {
  children: React.ReactNode;
}) => <div>{children}</div>;
