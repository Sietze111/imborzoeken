import { useEffect, useRef } from 'react';

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

interface CustomCommandItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  className?: string;
}

export const CustomCommandItem = ({
  children,
  onSelect,
  className,
}: CustomCommandItemProps) => {
  return (
    <div
      onClick={onSelect}
      className={`p-2 cursor-pointer hover:bg-gray-100 ${className}`}
    >
      {children}
    </div>
  );
};

interface CustomCommandEmptyProps {
  children: React.ReactNode;
}

export const CustomCommandEmpty = ({ children }: CustomCommandEmptyProps) => {
  return <div className="p-2 text-gray-500 text-center">{children}</div>;
};
