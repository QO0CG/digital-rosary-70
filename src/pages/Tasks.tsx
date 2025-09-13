import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { useTasbihStore } from '@/stores/tasbihStore';
import { Target, CheckCircle, Trophy, Star, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  type: 'daily' | 'weekly' | 'achievement';
  points: number;
  completed: boolean;
  icon: React.ElementType;
}

export const Tasks: React.FC = () => {
  const { 
    points, 
    level, 
    dailyGoal, 
    weeklyGoal,
    getTodayStats, 
    getWeeklyTotal,
    totalCount 
  } = useTasbihStore();
  
  const todayCount = getTodayStats()?.totalCount || 0;
  const weeklyCount = getWeeklyTotal();

  const tasks: Task[] = [
    {
      id: 'daily-goal',
      title: 'الهدف اليومي',
      description: `أكمل ${dailyGoal.toLocaleString('ar-EG')} تسبيحة اليوم`,
      target: dailyGoal,
      current: todayCount,
      type: 'daily',
      points: 50,
      completed: todayCount >= dailyGoal,
      icon: Target
    },
    {
      id: 'weekly-goal',
      title: 'الهدف الأسبوعي',
      description: `أكمل ${weeklyGoal.toLocaleString('ar-EG')} تسبيحة هذا الأسبوع`,
      target: weeklyGoal,
      current: weeklyCount,
      type: 'weekly',
      points: 200,
      completed: weeklyCount >= weeklyGoal,
      icon: Trophy
    },
    {
      id: 'first-thousand',
      title: 'الألف الأولى',
      description: 'اوصل إلى ١٠٠٠ تسبيحة',
      target: 1000,
      current: totalCount,
      type: 'achievement',
      points: 100,
      completed: totalCount >= 1000,
      icon: Star
    },
    {
      id: 'ten-thousand',
      title: 'العشرة آلاف',
      description: 'اوصل إلى ١٠٠٠٠ تسبيحة',
      target: 10000,
      current: totalCount,
      type: 'achievement',
      points: 500,
      completed: totalCount >= 10000,
      icon: Gift
    }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'daily': return 'يومي';
      case 'weekly': return 'أسبوعي';
      case 'achievement': return 'إنجاز';
      default: return '';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-primary/10 text-primary';
      case 'weekly': return 'bg-accent/10 text-accent';
      case 'achievement': return 'bg-dhikr-primary/10 text-dhikr-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const claimReward = (task: Task) => {
    if (!task.completed) return;
    
    toast({
      title: "تم استلام المكافأة!",
      description: `حصلت على ${task.points} نقطة`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="المهام والتحديات" />
      
      <div className="px-4 py-6 space-y-6">
        {/* بطاقة الملخص */}
        <Card className="card-islamic bg-gradient-card">
          <div className="p-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold">المستوى {level.toLocaleString('ar-EG')}</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {points.toLocaleString('ar-EG')}
                  </div>
                  <div className="text-sm text-muted-foreground">النقاط</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">
                    {completedTasks}/{totalTasks}
                  </div>
                  <div className="text-sm text-muted-foreground">المهام المكتملة</div>
                </div>
              </div>

              <Progress 
                value={(completedTasks / totalTasks) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </Card>

        {/* قائمة المهام */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المهام المتاحة</h3>
          
          {tasks.map((task) => {
            const Icon = task.icon;
            const progress = Math.min((task.current / task.target) * 100, 100);
            
            return (
              <Card key={task.id} className="card-islamic">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${getTypeColor(task.type)} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(task.type)}`}>
                            {getTypeLabel(task.type)}
                          </span>
                          {task.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {task.current.toLocaleString('ar-EG')} / {task.target.toLocaleString('ar-EG')}
                          </span>
                          <span className="text-muted-foreground">
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-accent font-medium">
                          {task.points} نقطة
                        </span>
                        {task.completed ? (
                          <Button
                            size="sm"
                            onClick={() => claimReward(task)}
                            className="btn-prayer"
                          >
                            استلام المكافأة
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                          >
                            غير مكتمل
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* معلومات إضافية */}
        <Card className="card-islamic">
          <div className="p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold">كيف تعمل النقاط؟</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• كل تسبيحة = نقطة واحدة</p>
              <p>• إكمال المهام اليومية = نقاط إضافية</p>
              <p>• كل ١٠٠٠ نقطة = مستوى جديد</p>
              <p>• المستويات العالية تفتح ميزات جديدة</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};