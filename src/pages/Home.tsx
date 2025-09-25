import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { useTasbihStore } from '@/stores/tasbihStore';
import { 
  RotateCcw, 
  BookOpen, 
  Target, 
  BarChart3, 
  Settings, 
  Award 
} from 'lucide-react';

const menuItems = [
  {
    title: 'المسبحة الإلكترونية',
    description: 'ابدأ التسبيح والذكر',
    icon: RotateCcw,
    to: '/tasbih',
    color: 'from-primary to-primary-glow'
  },
  {
    title: 'الأذكار والأدعية',
    description: 'مجموعة شاملة من الأذكار',
    icon: BookOpen,
    to: '/dhikr',
    color: 'from-accent to-accent-glow'
  },
  {
    title: 'المهام والتحديات',
    description: 'حقق أهدافك اليومية',
    icon: Target,
    to: '/tasks',
    color: 'from-dhikr-primary to-dhikr-secondary'
  },
  {
    title: 'الإحصائيات',
    description: 'تتبع تقدمك',
    icon: BarChart3,
    to: '/stats',
    color: 'from-prayer-time to-blessing'
  },
  {
    title: 'الإعدادات',
    description: 'خصص تجربتك',
    icon: Settings,
    to: '/settings',
    color: 'from-muted to-secondary'
  }
];

export const Home: React.FC = () => {
  const { totalCount, points, level, getTodayStats } = useTasbihStore();
  const todayStats = getTodayStats();

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="المسبحة الذكية" />
      
      <div className="px-4 py-6 space-y-6">
        {/* رسالة الترحيب */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gradient-primary">
            أهلاً وسهلاً
          </h2>
          <p className="text-muted-foreground">
            هيا ابدأ في التسبيح
          </p>
        </div>

        {/* بطاقة الإحصائيات السريعة */}
        <Card className="card-islamic bg-gradient-card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">إحصائياتي</h3>
              <div className="flex items-center gap-1 text-accent">
                <Award className="w-5 h-5" />
                <span className="font-bold">المستوى {level.toLocaleString('ar-EG')}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {totalCount.toLocaleString('ar-EG')}
                </div>
                <div className="text-sm text-muted-foreground">إجمالي التسبيحات</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">
                  {(todayStats?.totalCount || 0).toLocaleString('ar-EG')}
                </div>
                <div className="text-sm text-muted-foreground">اليوم</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-dhikr-primary">
                  {points.toLocaleString('ar-EG')}
                </div>
                <div className="text-sm text-muted-foreground">النقاط</div>
              </div>
            </div>
          </div>
        </Card>

        {/* شبكة القوائم الرئيسية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center">الأقسام الرئيسية</h3>
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to}>
                  <Card className="card-islamic group">
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                          <p className="text-muted-foreground text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* بطاقة دعوة للعمل */}
        <Card className="card-islamic bg-gradient-primary text-primary-foreground">
          <div className="p-6 text-center">
            <h3 className="text-lg font-bold mb-2">ابدأ التسبيح الآن</h3>
            <p className="text-primary-foreground/80 mb-4">
              ابدأ رحلتك الروحانية معنا
            </p>
            <Link to="/tasbih">
              <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-3 rounded-full transition-colors">
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">ابدأ التسبيح</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};