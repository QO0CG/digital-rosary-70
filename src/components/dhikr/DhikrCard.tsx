import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, ChevronLeft } from 'lucide-react';
import { Dhikr } from '@/data/dhikr';

interface DhikrCardProps {
  dhikr: Dhikr;
  onToggleFavorite: (id: number) => void;
  onShare: (dhikr: Dhikr) => void;
  onClick: (dhikr: Dhikr) => void;
  isFavorite: boolean;
}

export const DhikrCard: React.FC<DhikrCardProps> = ({
  dhikr,
  onToggleFavorite,
  onShare,
  onClick,
  isFavorite
}) => {
  return (
    <Card 
      className="card-islamic cursor-pointer group"
      onClick={() => onClick(dhikr)}
    >
      <div className="p-4">
        {/* رأس البطاقة */}
        <div className="flex items-start justify-between mb-3">
          <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
            {dhikr.categoryName}
          </span>
          <ChevronLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>

        {/* نص الذكر */}
        <p className="dhikr-text text-right leading-loose mb-4 line-clamp-3">
          {dhikr.arabic}
        </p>

        {/* تفاصيل إضافية والأزرار */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {dhikr.repetitions && (
              <span>التكرار: {dhikr.repetitions.toLocaleString('ar-EG')}</span>
            )}
            {dhikr.reference && (
              <span className="text-xs">{dhikr.reference}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(dhikr.id);
              }}
              className="w-8 h-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <Heart 
                className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare(dhikr);
              }}
              className="w-8 h-8 p-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};