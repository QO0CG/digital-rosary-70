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
        <div className="text-center space-y-2 animate-fade-in">
          <h2 className="text-3xl font-bold text-gradient-primary drop-shadow-glow animate-bounce-soft">
            أهلاً وسهلاً
          </h2>
          <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '200ms' }}>
            هيا ابدأ في التسبيح
          </p>
        </div>

        {/* بطاقة الإحصائيات السريعة */}
        <Card className="card-islamic bg-gradient-card shadow-elegant hover:shadow-glow transition-all duration-300 animate-fade-in border border-white/10 backdrop-blur-sm">
          <div className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold glow-primary">إحصائياتي</h3>
                <div className="flex items-center gap-1 text-accent animate-pulse-ring">
                  <Award className="w-5 h-5 drop-shadow-glow" />
                  <span className="font-bold">المستوى {level.toLocaleString('ar-EG')}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center bg-white/5 rounded-lg p-3 border border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <div className="text-2xl font-bold text-primary drop-shadow-glow animate-bounce-soft">
                    {totalCount.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-sm text-muted-foreground">إجمالي التسبيحات</div>
                </div>
                <div className="text-center bg-white/5 rounded-lg p-3 border border-accent/20 hover:border-accent/40 transition-all duration-300">
                  <div className="text-2xl font-bold text-accent drop-shadow-glow animate-bounce-soft">
                    {(todayStats?.totalCount || 0).toLocaleString('ar-EG')}
                  </div>
                  <div className="text-sm text-muted-foreground">اليوم</div>
                </div>
                <div className="text-center bg-white/5 rounded-lg p-3 border border-dhikr-primary/20 hover:border-dhikr-primary/40 transition-all duration-300">
                  <div className="text-2xl font-bold text-dhikr-primary drop-shadow-glow animate-bounce-soft">
                    {points.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-sm text-muted-foreground">النقاط</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* شبكة القوائم الرئيسية */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-center glow-accent animate-fade-in">الأقسام الرئيسية</h3>
          <div className="grid grid-cols-1 gap-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to}>
                  <Card className="card-islamic group hover:shadow-glow transition-all duration-300 border border-white/10 backdrop-blur-sm hover:scale-[1.02] animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="p-6 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-elegant group-hover:shadow-glow group-hover:scale-110 transition-all duration-300 border border-white/20`}>
                          <Icon className="w-7 h-7 text-white drop-shadow-lg group-hover:drop-shadow-glow" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors duration-300">{item.title}</h4>
                          <p className="text-muted-foreground text-sm group-hover:text-muted-foreground/80 transition-colors duration-300">{item.description}</p>
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
        <Card className="card-islamic bg-gradient-primary text-primary-foreground shadow-elegant hover:shadow-glow transition-all duration-300 border border-white/20 backdrop-blur-sm animate-fade-in">
          <div className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-4 drop-shadow-glow animate-pulse-ring">ابدأ التسبيح الآن</h3>
              <Link to="/tasbih">
                <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/40 px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-glow hover:scale-105 border border-white/30">
                  <RotateCcw className="w-6 h-6 animate-spin-slow" />
                  <span className="font-bold text-lg">ابدأ التسبيح</span>
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};