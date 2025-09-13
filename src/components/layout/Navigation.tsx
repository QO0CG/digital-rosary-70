import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  RotateCcw, 
  BookOpen, 
  Target, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const navigationItems = [
  { 
    to: '/', 
    label: 'الرئيسية', 
    icon: Home 
  },
  { 
    to: '/tasbih', 
    label: 'المسبحة', 
    icon: RotateCcw 
  },
  { 
    to: '/dhikr', 
    label: 'الأذكار', 
    icon: BookOpen 
  },
  { 
    to: '/tasks', 
    label: 'المهام', 
    icon: Target 
  },
  { 
    to: '/stats', 
    label: 'الإحصائيات', 
    icon: BarChart3 
  },
  { 
    to: '/settings', 
    label: 'الإعدادات', 
    icon: Settings 
  }
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border/50 backdrop-blur-sm z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item min-w-0 flex-1 ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5 mx-auto" />
              <span className="text-xs font-medium text-center truncate">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};