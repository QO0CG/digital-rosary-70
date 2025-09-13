import React from 'react';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { StatsChart } from '@/components/charts/StatsChart';
import { useTasbihStore } from '@/stores/tasbihStore';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

export const Statistics: React.FC = () => {
  const { 
    totalCount, 
    dailyStats, 
    bestDay, 
    getTodayStats, 
    getWeeklyTotal, 
    getMonthlyTotal,
    dailyGoal 
  } = useTasbihStore();

  const todayCount = getTodayStats()?.totalCount || 0;
  const weeklyCount = getWeeklyTotal();
  const monthlyCount = getMonthlyTotal();
  
  // إعداد بيانات الرسم البياني للأسبوع الماضي
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayStats = dailyStats.find(stat => stat.date === dateString);
    
    return {
      date: dateString,
      count: dayStats?.totalCount || 0,
      label: date.toLocaleDateString('ar-EG', { weekday: 'short' })
    };
  }).reverse();

  // حساب المتوسط اليومي
  const averageDaily = dailyStats.length > 0 
    ? Math.round(dailyStats.reduce((sum, stat) => sum + stat.totalCount, 0) / dailyStats.length)
    : 0;

  // إحصائيات العقد الماضي
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayStats = dailyStats.find(stat => stat.date === dateString);
    
    return {
      date: dateString,
      count: dayStats?.totalCount || 0,
      label: date.getDate().toString()
    };
  }).reverse();

  const stats = [
    {
      title: 'إجمالي التسبيحات',
      value: totalCount.toLocaleString('ar-EG'),
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'تسبيحات اليوم',
      value: todayCount.toLocaleString('ar-EG'),
      subtitle: `من ${dailyGoal.toLocaleString('ar-EG')}`,
      icon: Calendar,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'هذا الأسبوع',
      value: weeklyCount.toLocaleString('ar-EG'),
      icon: Target,
      color: 'text-dhikr-primary',
      bgColor: 'bg-dhikr-primary/10'
    },
    {
      title: 'أفضل يوم',
      value: bestDay ? bestDay.count.toLocaleString('ar-EG') : '0',
      subtitle: bestDay ? new Date(bestDay.date).toLocaleDateString('ar-EG') : 'لا يوجد',
      icon: Award,
      color: 'text-blessing',
      bgColor: 'bg-blessing/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="الإحصائيات" />
      
      <div className="px-4 py-6 space-y-6">
        {/* البطاقات الإحصائية */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="card-islamic">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {stat.title}
                    </div>
                    {stat.subtitle && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {stat.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* إحصائيات إضافية */}
        <Card className="card-islamic">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">ملخص سريع</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المتوسط اليومي</span>
                <span className="font-bold text-primary">
                  {averageDaily.toLocaleString('ar-EG')} تسبيحة
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">هذا الشهر</span>
                <span className="font-bold text-accent">
                  {monthlyCount.toLocaleString('ar-EG')} تسبيحة
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">أيام النشاط</span>
                <span className="font-bold text-dhikr-primary">
                  {dailyStats.filter(stat => stat.totalCount > 0).length.toLocaleString('ar-EG')} يوم
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* رسم بياني للأسبوع الماضي */}
        <StatsChart 
          data={last7Days}
          title="إحصائيات الأسبوع الماضي"
          color="hsl(var(--primary))"
        />

        {/* رسم بياني للشهر الماضي */}
        <StatsChart 
          data={last30Days}
          title="إحصائيات الشهر الماضي"
          color="hsl(var(--accent))"
        />

        {/* تقييم الأداء */}
        <Card className="card-islamic">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-4">تقييم الأداء</h3>
            {todayCount >= dailyGoal ? (
              <div className="space-y-2">
                <div className="text-4xl">🎉</div>
                <p className="text-primary font-medium">ممتاز! لقد حققت هدفك اليوم</p>
                <p className="text-sm text-muted-foreground">
                  واصل العمل الرائع وحافظ على هذا الأداء
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl">💪</div>
                <p className="text-accent font-medium">
                  باقي {(dailyGoal - todayCount).toLocaleString('ar-EG')} تسبيحة لتحقيق هدفك
                </p>
                <p className="text-sm text-muted-foreground">
                  يمكنك تحقيق هدفك اليومي بسهولة
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};