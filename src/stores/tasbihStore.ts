import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// أنواع البيانات المستخدمة في المتجر
interface TasbihSession {
  id: string;
  type: string;
  count: number;
  date: string;
  completed: boolean;
}

interface DailyStats {
  date: string;
  totalCount: number;
  sessions: TasbihSession[];
}

interface TasbihState {
  // حالة العداد الحالي
  currentCount: number;
  currentType: string;
  targetCount: number;
  
  // الإحصائيات
  totalCount: number;
  dailyStats: DailyStats[];
  currentStreak: number;
  bestDay: { date: string; count: number } | null;
  
  // الإعدادات
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  darkMode: boolean;
  notifications: boolean;
  
  // المهام والتحديات
  dailyGoal: number;
  weeklyGoal: number;
  points: number;
  level: number;
  
  // الأعمال (Actions)
  increment: () => void;
  reset: () => void;
  setType: (type: string) => void;
  setTargetCount: (count: number) => void;
  saveSession: () => void;
  
  // إعدادات
  toggleSound: () => void;
  toggleVibration: () => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  setDailyGoal: (goal: number) => void;
  setWeeklyGoal: (goal: number) => void;
  
  // إحصائيات
  updateStats: (count: number) => void;
  getTodayStats: () => DailyStats | null;
  getWeeklyTotal: () => number;
  getMonthlyTotal: () => number;
}

// دالة لتوليد معرف فريد
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// دالة للحصول على تاريخ اليوم بصيغة معيارية
const getTodayDate = () => new Date().toISOString().split('T')[0];

// دالة لحساب المستوى بناءً على النقاط
const calculateLevel = (points: number) => Math.floor(points / 1000) + 1;

// دالة لتشغيل الصوت
const playSound = () => {
  if (typeof window !== 'undefined' && 'AudioContext' in window) {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
};

// دالة للاهتزاز
const vibrate = () => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(50);
  }
};

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set, get) => ({
      // الحالة الأولية
      currentCount: 0,
      currentType: 'سبحان الله',
      targetCount: 33,
      totalCount: 0,
      dailyStats: [],
      currentStreak: 0,
      bestDay: null,
      
      // الإعدادات الافتراضية
      soundEnabled: true,
      vibrationEnabled: true,
      darkMode: false,
      notifications: true,
      
      // المهام والنقاط
      dailyGoal: 300,
      weeklyGoal: 2000,
      points: 0,
      level: 1,
      
      // زيادة العداد
      increment: () => {
        const state = get();
        const newCount = state.currentCount + 1;
        
        // تشغيل الصوت والاهتزاز إذا كانا مفعلين (فقط إذا لم نصل للهدف بعد)
        if (state.currentCount < state.targetCount) {
          if (state.soundEnabled) playSound();
          if (state.vibrationEnabled) vibrate();
        }
        
        set({ 
          currentCount: newCount,
          totalCount: state.totalCount + 1,
          points: state.points + 1,
          level: calculateLevel(state.points + 1)
        });
        
        // تحديث الإحصائيات
        state.updateStats(1);
      },
      
      // إعادة تعيين العداد
      reset: () => {
        set({ currentCount: 0 });
      },
      
      // تغيير نوع التسبيح
      setType: (type: string) => {
        set({ currentType: type, currentCount: 0 });
      },
      
      // تعيين الهدف
      setTargetCount: (count: number) => {
        set({ targetCount: count });
      },
      
      // حفظ الجلسة
      saveSession: () => {
        const state = get();
        if (state.currentCount === 0) return;
        
        const session: TasbihSession = {
          id: generateId(),
          type: state.currentType,
          count: state.currentCount,
          date: new Date().toISOString(),
          completed: state.currentCount >= state.targetCount
        };
        
        const today = getTodayDate();
        const todayStats = state.dailyStats.find(stat => stat.date === today);
        
        if (todayStats) {
          todayStats.sessions.push(session);
          todayStats.totalCount += state.currentCount;
        } else {
          const newDayStats: DailyStats = {
            date: today,
            totalCount: state.currentCount,
            sessions: [session]
          };
          set({ dailyStats: [...state.dailyStats, newDayStats] });
        }
        
        // إعادة تعيين العداد
        set({ currentCount: 0 });
      },
      
      // تبديل الصوت
      toggleSound: () => {
        set(state => ({ soundEnabled: !state.soundEnabled }));
      },
      
      // تبديل الاهتزاز
      toggleVibration: () => {
        set(state => ({ vibrationEnabled: !state.vibrationEnabled }));
      },
      
      // تبديل الوضع الليلي
      toggleDarkMode: () => {
        set(state => {
          const newDarkMode = !state.darkMode;
          // تطبيق الوضع الليلي على المستند
          if (typeof document !== 'undefined') {
            if (newDarkMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { darkMode: newDarkMode };
        });
      },
      
      // تبديل الإشعارات
      toggleNotifications: () => {
        set(state => ({ notifications: !state.notifications }));
      },
      
      // تعيين الهدف اليومي
      setDailyGoal: (goal: number) => {
        set({ dailyGoal: goal });
      },
      
      // تعيين الهدف الأسبوعي
      setWeeklyGoal: (goal: number) => {
        set({ weeklyGoal: goal });
      },
      
      // تحديث الإحصائيات
      updateStats: (count: number) => {
        const state = get();
        const today = getTodayDate();
        const todayStats = state.dailyStats.find(stat => stat.date === today);
        
        if (todayStats) {
          todayStats.totalCount += count;
        } else {
          const newDayStats: DailyStats = {
            date: today,
            totalCount: count,
            sessions: []
          };
          set({ dailyStats: [...state.dailyStats, newDayStats] });
        }
        
        // تحديث أفضل يوم
        const updatedStats = state.dailyStats.map(stat => 
          stat.date === today 
            ? { ...stat, totalCount: (todayStats?.totalCount || 0) + count }
            : stat
        );
        
        const bestDay = updatedStats.reduce((best, current) => {
          if (!best || current.totalCount > best.count) {
            return { date: current.date, count: current.totalCount };
          }
          return best;
        }, state.bestDay);
        
        set({ bestDay });
      },
      
      // الحصول على إحصائيات اليوم
      getTodayStats: () => {
        const state = get();
        const today = getTodayDate();
        return state.dailyStats.find(stat => stat.date === today) || null;
      },
      
      // الحصول على إجمالي الأسبوع
      getWeeklyTotal: () => {
        const state = get();
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        return state.dailyStats
          .filter(stat => {
            const statDate = new Date(stat.date);
            return statDate >= weekAgo && statDate <= today;
          })
          .reduce((total, stat) => total + stat.totalCount, 0);
      },
      
      // الحصول على إجمالي الشهر
      getMonthlyTotal: () => {
        const state = get();
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return state.dailyStats
          .filter(stat => {
            const statDate = new Date(stat.date);
            return statDate >= monthAgo && statDate <= today;
          })
          .reduce((total, stat) => total + stat.totalCount, 0);
      }
    }),
    {
      name: 'tasbih-storage',
      version: 1,
    }
  )
);