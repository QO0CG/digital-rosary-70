import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { adhkar, toggleFavorite, getFavoriteDhikr } from '@/data/dhikr';
import { Heart, Share2, ChevronRight, ChevronLeft, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DhikrDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dhikrId = parseInt(id || '0');
  const dhikr = adhkar.find(d => d.id === dhikrId);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getFavoriteDhikr());
  
  if (!dhikr) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="الذكر غير موجود" />
        <div className="px-4 py-6 text-center">
          <p className="text-muted-foreground">الذكر المطلوب غير موجود</p>
          <Link to="/dhikr">
            <Button className="mt-4">العودة للأذكار</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = adhkar.findIndex(d => d.id === dhikrId);
  const prevDhikr = currentIndex > 0 ? adhkar[currentIndex - 1] : null;
  const nextDhikr = currentIndex < adhkar.length - 1 ? adhkar[currentIndex + 1] : null;
  const isFavorite = favoriteIds.includes(dhikr.id);

  const handleToggleFavorite = () => {
    const updatedFavorites = toggleFavorite(dhikr.id);
    setFavoriteIds(updatedFavorites);
    
    const isAdded = updatedFavorites.includes(dhikr.id);
    toast({
      title: isAdded ? "تم إضافة الذكر للمفضلة" : "تم إزالة الذكر من المفضلة"
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dhikr.arabic);
      toast({
        title: "تم نسخ الذكر",
        description: "تم نسخ النص إلى الحافظة"
      });
    } catch (error) {
      console.error('Error copying:', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: dhikr.categoryName,
          text: dhikr.arabic,
        });
      } else {
        await handleCopy();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title={dhikr.categoryName} />
      
      <div className="px-4 py-6 space-y-6">
        {/* بطاقة الذكر الرئيسية */}
        <Card className="card-islamic">
          <div className="p-6 max-w-4xl mx-auto">
            {/* تصنيف الذكر */}
            <div className="text-center mb-4">
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                {dhikr.categoryName}
              </span>
            </div>

            {/* نص الذكر */}
            <div className="text-center space-y-4">
              <div className="min-h-[120px] flex items-center justify-center">
                <p className="dhikr-text text-xl leading-relaxed max-w-2xl break-words">
                  {dhikr.arabic}
                </p>
              </div>
              
              {/* معلومات إضافية */}
              <div className="space-y-2 text-center">
                {dhikr.repetitions && (
                  <div className="text-base">
                    <span className="text-muted-foreground">التكرار: </span>
                    <span className="font-bold text-primary">
                      {dhikr.repetitions.toLocaleString('ar-EG')} مرة
                    </span>
                  </div>
                )}
                
                {dhikr.reference && (
                  <div className="text-sm text-muted-foreground">
                    المرجع: {dhikr.reference}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* أزرار الإجراءات */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={handleToggleFavorite}
            className="w-full"
          >
            <Heart className={`w-4 h-4 ml-2 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? "في المفضلة" : "إضافة للمفضلة"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCopy}
            className="w-full"
          >
            <Copy className="w-4 h-4 ml-2" />
            نسخ النص
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="w-full"
          >
            <Share2 className="w-4 h-4 ml-2" />
            مشاركة
          </Button>
        </div>

        {/* أزرار التنقل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
          {prevDhikr && (
            <Link to={`/dhikr/${prevDhikr.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                <ChevronRight className="w-4 h-4 ml-2" />
                الذكر السابق
              </Button>
            </Link>
          )}
          
          {nextDhikr && (
            <Link to={`/dhikr/${nextDhikr.id}`} className={prevDhikr ? "w-full" : "w-full col-span-2"}>
              <Button variant="outline" className="w-full">
                الذكر التالي
                <ChevronLeft className="w-4 h-4 mr-2" />
              </Button>
            </Link>
          )}
        </div>

        {/* العودة للقائمة */}
        <div className="text-center">
          <Link to="/dhikr">
            <Button variant="outline">
              العودة لقائمة الأذكار
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};