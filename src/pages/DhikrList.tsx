import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { DhikrCard } from '@/components/dhikr/DhikrCard';
import { adhkar, dhikrCategories, toggleFavorite, getFavoriteDhikr, Dhikr } from '@/data/dhikr';
import { Search, Filter, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const DhikrList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getFavoriteDhikr());

  const filteredDhikr = useMemo(() => {
    let filtered = adhkar;

    // تصفية حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(dhikr => dhikr.category === selectedCategory);
    }

    // تصفية حسب البحث
    if (searchQuery) {
      filtered = filtered.filter(dhikr => 
        dhikr.arabic.includes(searchQuery) || 
        dhikr.categoryName.includes(searchQuery) ||
        dhikr.reference?.includes(searchQuery)
      );
    }

    // إظهار المفضلة فقط
    if (showFavorites) {
      filtered = filtered.filter(dhikr => favoriteIds.includes(dhikr.id));
    }

    return filtered;
  }, [searchQuery, selectedCategory, showFavorites, favoriteIds]);

  const handleToggleFavorite = (dhikrId: number) => {
    const updatedFavorites = toggleFavorite(dhikrId);
    setFavoriteIds(updatedFavorites);
    
    const isAdded = updatedFavorites.includes(dhikrId);
    toast({
      title: isAdded ? "تم إضافة الذكر للمفضلة" : "تم إزالة الذكر من المفضلة",
      description: isAdded ? "يمكنك العثور عليه في قسم المفضلة" : ""
    });
  };

  const handleShare = async (dhikr: Dhikr) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: dhikr.categoryName,
          text: dhikr.arabic,
        });
      } else {
        await navigator.clipboard.writeText(dhikr.arabic);
        toast({
          title: "تم نسخ الذكر",
          description: "تم نسخ النص إلى الحافظة"
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const categories = Object.entries(dhikrCategories);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="الأذكار والأدعية" />
      
      <div className="px-4 py-6 space-y-6">
        {/* شريط البحث */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="ابحث في الأذكار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* أزرار التصفية */}
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="whitespace-nowrap"
            >
              الكل
            </Button>
            {categories.map(([key, name]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="whitespace-nowrap"
              >
                {name}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showFavorites ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFavorites(!showFavorites)}
              className="flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              المفضلة ({favoriteIds.length})
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowFavorites(false);
              }}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              مسح التصفية
            </Button>
          </div>
        </div>

        {/* نتائج البحث */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              النتائج ({filteredDhikr.length.toLocaleString('ar-EG')})
            </h3>
          </div>

          {filteredDhikr.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>لا توجد أذكار تطابق البحث</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDhikr.map((dhikr) => (
                <DhikrCard
                  key={dhikr.id}
                  dhikr={dhikr}
                  onToggleFavorite={handleToggleFavorite}
                  onShare={handleShare}
                  onClick={(dhikr) => window.open(`/dhikr/${dhikr.id}`, '_self')}
                  isFavorite={favoriteIds.includes(dhikr.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};