import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { useTasbihStore } from '@/stores/tasbihStore';
import { 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Bell, 
  BellOff, 
  Download, 
  Upload, 
  Info,
  Moon,
  Sun,
  Target,
  Trash2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const Settings: React.FC = () => {
  const {
    soundEnabled,
    vibrationEnabled,
    darkMode,
    notifications,
    dailyGoal,
    weeklyGoal,
    toggleSound,
    toggleVibration,
    toggleDarkMode,
    toggleNotifications,
    setDailyGoal,
    setWeeklyGoal
  } = useTasbihStore();

  const handleExportData = () => {
    try {
      const data = localStorage.getItem('tasbih-storage');
      if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tasbih-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "تم تصدير البيانات",
          description: "تم حفظ نسخة احتياطية من بياناتك"
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string;
          localStorage.setItem('tasbih-storage', data);
          
          toast({
            title: "تم استيراد البيانات",
            description: "تم استعادة بياناتك بنجاح. سيتم إعادة تحميل الصفحة."
          });
          
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } catch (error) {
          toast({
            title: "خطأ في الاستيراد",
            description: "ملف البيانات غير صالح",
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      localStorage.removeItem('tasbih-storage');
      toast({
        title: "تم حذف البيانات",
        description: "تم حذف جميع البيانات. سيتم إعادة تحميل الصفحة."
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="الإعدادات" />
      
      <div className="px-4 py-6 space-y-6">

        {/* إعدادات الأهداف */}
        <Card className="card-islamic">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">الأهداف</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Target className="w-4 h-4" />
                  الهدف اليومي
                </label>
                <Input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value) || 0)}
                  min="1"
                  className="text-center"
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Target className="w-4 h-4" />
                  الهدف الأسبوعي
                </label>
                <Input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 0)}
                  min="1"
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* إدارة البيانات */}
        <Card className="card-islamic">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">إدارة البيانات</h3>
            <div className="space-y-3">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 ml-2" />
                تصدير البيانات
              </Button>
              
              <div>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button
                  onClick={() => document.getElementById('import-file')?.click()}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Upload className="w-4 h-4 ml-2" />
                  استيراد البيانات
                </Button>
              </div>
              
              <Button
                onClick={handleClearData}
                variant="destructive"
                className="w-full justify-start"
              >
                <Trash2 className="w-4 h-4 ml-2" />
                حذف جميع البيانات
              </Button>
            </div>
          </div>
        </Card>

        {/* معلومات التطبيق */}
        <Card className="card-islamic">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">حول التطبيق</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>المسبحة الذكية</strong></p>
              <p>الإصدار ١.٠.٠</p>
              <p>تطبيق شامل للأذكار والتسبيح</p>
              <p className="text-xs">
                جميع الأذكار والأدعية مأخوذة من القرآن الكريم والسنة النبوية الشريفة
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};