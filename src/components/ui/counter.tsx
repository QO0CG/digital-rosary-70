import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Minus, Plus } from 'lucide-react';

interface CounterProps {
  count: number;
  onIncrement: () => void;
  onDecrement?: () => void;
  onReset: () => void;
  size?: 'sm' | 'md' | 'lg';
  showControls?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
  count,
  onIncrement,
  onDecrement,
  onReset,
  size = 'lg',
  showControls = true
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20 text-2xl',
    md: 'w-32 h-32 text-4xl',
    lg: 'w-48 h-48 text-6xl'
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* العداد الرئيسي */}
      <div className={`counter-display ${sizeClasses[size]} animate-counter-update`}>
        {count.toLocaleString('ar-EG')}
      </div>

      {/* أزرار التحكم */}
      {showControls && (
        <div className="flex items-center gap-4">
          {onDecrement && (
            <Button
              variant="outline"
              size="icon"
              onClick={onDecrement}
              disabled={count === 0}
              className="w-12 h-12 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            className="w-12 h-12 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onIncrement}
            className="w-12 h-12 rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};