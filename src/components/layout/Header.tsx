import React from 'react';
import { Moon, Sun, Settings } from 'lucide-react';
import { useTasbihStore } from '@/stores/tasbihStore';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  title: string;
  showSettings?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showSettings = false }) => {
  const { darkMode, toggleDarkMode } = useTasbihStore();

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">م</span>
          </div>
          <h1 className="text-lg font-bold text-gradient-primary">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="w-9 h-9 p-0"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          {showSettings && (
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};