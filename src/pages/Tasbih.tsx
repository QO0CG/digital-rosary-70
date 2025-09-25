import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/Header';
import { Counter } from '@/components/ui/counter';
import { useTasbihStore } from '@/stores/tasbihStore';
import { tasbihTypes } from '@/data/dhikr';
import { Save, Target, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Tasbih: React.FC = () => {
  const {
    currentCount,
    currentType,
    targetCount,
    increment,
    reset,
    setType,
    setTargetCount,
    saveSession,
    soundEnabled,
    vibrationEnabled
  } = useTasbihStore();

  const [customTarget, setCustomTarget] = useState<string>(targetCount.toString());
  const [showCelebration, setShowCelebration] = useState(false);
  const [previousCount, setPreviousCount] = useState(currentCount);

  const handleSaveSession = () => {
    if (currentCount === 0) {
      toast({
        title: "لا توجد تسبيحات للحفظ",
        description: "ابدأ التسبيح أولاً",
        variant: "destructive"
      });
      return;
    }

    saveSession();
    toast({
      title: "تم حفظ الجلسة",
      description: `تم حفظ ${currentCount.toLocaleString('ar-EG')} تسبيحة`,
    });
  };

  const handleTargetChange = (value: string) => {
    const num = parseInt(value);
    if (!isNaN(num) && num > 0) {
      setTargetCount(num);
      setCustomTarget(value);
    }
  };

  const progress = Math.min((currentCount / targetCount) * 100, 100);
  const isCompleted = currentCount >= targetCount;

  // تتبع الوصول للهدف
  useEffect(() => {
    if (currentCount >= targetCount && previousCount < targetCount && currentCount > 0) {
      setShowCelebration(true);
      toast({
        title: "🎉 مبارك! تم إنجاز الهدف",
        description: `لقد أكملت ${targetCount.toLocaleString('ar-EG')} تسبيحة من ${currentType}`,
      });
      // إخفاء التأثير بعد 3 ثوانٍ
      setTimeout(() => setShowCelebration(false), 3000);
    }
    setPreviousCount(currentCount);
  }, [currentCount, targetCount, previousCount, currentType]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="المسبحة الإلكترونية" />
      
      <div className="px-4 py-4 space-y-4">
        {/* بطاقة اختيار نوع التسبيح */}
        <Card className="card-islamic">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">اختر نوع التسبيح</h3>
            <Select value={currentType} onValueChange={setType}>
              <SelectTrigger className="w-full text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tasbihTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-right">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* بطاقة تحديد الهدف */}
        <Card className="card-islamic">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">الهدف المطلوب</h3>
            <div className="flex gap-2">
              {[33, 100, 500, 1000].map((target) => (
                <Button
                  key={target}
                  variant={targetCount === target ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTargetChange(target.toString())}
                  className="flex-1"
                >
                  {target.toLocaleString('ar-EG')}
                </Button>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                onBlur={() => handleTargetChange(customTarget)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-center"
                placeholder="هدف مخصص"
                min="1"
              />
            </div>
          </div>
        </Card>

        {/* العداد الرئيسي */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-bold dhikr-text">{currentType}</h2>
            <div className="text-sm text-muted-foreground">
              {progress.toFixed(0)}% من الهدف ({targetCount.toLocaleString('ar-EG')})
            </div>
          </div>

          {/* شريط التقدم */}
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* زر العد الرئيسي */}
          <div className="relative flex justify-center">
            <div className="relative">
              <Button
                size="lg"
                onClick={increment}
                className="btn-dhikr w-40 h-40 rounded-full text-lg font-bold relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-200" />
                <div className="relative z-10">
                  <div className="text-2xl mb-1">{currentCount.toLocaleString('ar-EG')}</div>
                  <div className="text-xs opacity-80">اضغط للعد</div>
                </div>
              </Button>
              
              {/* تأثير الإشارات الصفراء عند الإنجاز - محصور في الزر فقط */}
              {showCelebration && (
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-4 border-yellow-400 rounded-full animate-pulse" />
                  <div className="absolute inset-2 border-2 border-yellow-300 rounded-full animate-ping" />
                  <div className="absolute inset-4 border border-yellow-200 rounded-full animate-bounce" />
                </div>
              )}
            </div>
          </div>

          {/* تأكيد الإعدادات */}
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span className={soundEnabled ? "text-primary" : ""}>
              الصوت: {soundEnabled ? "مفعل" : "معطل"}
            </span>
            <span className={vibrationEnabled ? "text-primary" : ""}>
              الاهتزاز: {vibrationEnabled ? "مفعل" : "معطل"}
            </span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={reset}
            className="flex-1 max-w-32"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
          
          <Button
            onClick={handleSaveSession}
            disabled={currentCount === 0}
            className="flex-1 max-w-32 btn-prayer"
          >
            <Save className="w-4 h-4 ml-2" />
            حفظ الجلسة
          </Button>
        </div>

        {/* رسالة التشجيع */}
        {isCompleted && (
          <Card className="card-islamic bg-gradient-secondary text-accent-foreground animate-fade-in-up">
            <div className="p-6 text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="text-lg font-bold mb-2">مبارك! تم إنجاز الهدف</h3>
              <p className="text-sm opacity-80">
                لقد أكملت {targetCount.toLocaleString('ar-EG')} تسبيحة من {currentType}
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};