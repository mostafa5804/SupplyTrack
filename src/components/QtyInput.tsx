import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface QtyInputProps {
  value: number | string;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
}

export function QtyInput({ value, onChange, min = 0, max, className, inputClassName, placeholder }: QtyInputProps) {
  const handleDec = () => {
    const current = parseInt(value as string) || 0;
    if (current > min) {
      onChange((current - 1).toString());
    }
  };

  const handleInc = () => {
    const current = parseInt(value as string) || 0;
    if (max === undefined || current < max) {
      onChange((current + 1).toString());
    }
  };

  return (
    <div className={cn("flex items-center gap-1 shrink-0", className)}>
      <button 
        type="button" 
        onClick={handleDec}
        disabled={value !== '' && parseInt(value as string) <= min}
        className="w-10 h-10 md:w-8 md:h-8 flex shrink-0 items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg disabled:opacity-50 transition-colors"
      >
        <Minus size={18} />
      </button>
      <input
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("bg-background border border-border rounded-lg text-center font-bold outline-none focus:ring-2 h-10 md:h-8 w-12 sm:w-14 shrink-0 text-sm", inputClassName)}
        style={{ WebkitAppearance: 'none', margin: 0, padding: 0 }}
      />
      <button 
        type="button" 
        onClick={handleInc}
        disabled={max !== undefined && value !== '' && parseInt(value as string) >= max}
        className="w-10 h-10 md:w-8 md:h-8 flex shrink-0 items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg disabled:opacity-50 transition-colors"
      >
        <Plus size={18} />
      </button>
    </div>
  );
}
