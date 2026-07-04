import React from 'react';
import { useAuth } from '../store/AuthContext';
import { useTheme } from '../store/ThemeContext';
import { Search, Bell, Moon, Sun, Menu, ArrowRight, Calendar, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { farsiDateLong } from '../lib/utils';

const routeTitles: Record<string, string> = {
  '/': 'داشبورد اصلی',
  '/requests': 'مدیریت درخواست‌ها',
  '/supervisor': 'تأیید سرپرست',
  '/warehouse': 'انبار',
  '/purchasing': 'لیست خرید',
  '/users': 'مدیریت کاربران',
  '/settings': 'تنظیمات سامانه',
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-500',
  requester: 'bg-blue-500',
  supervisor: 'bg-amber-500',
  storekeeper: 'bg-cyan-500',
  purchaser: 'bg-green-500',
};

const roleLabels: Record<string, string> = {
  admin: 'ادمین سیستم',
  requester: 'درخواست‌کننده',
  supervisor: 'سرپرست کارگاه',
  storekeeper: 'انباردار',
  purchaser: 'مسئول خرید',
};

export function Topbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const title = routeTitles[location.pathname] || 'سامانه';
  const currentDate = farsiDateLong();

  if (!user) return null;

  return (
    <header className="print:hidden h-16 bg-card border-b border-border px-4 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        
        {location.pathname !== '/' && (
          <button 
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-secondary transition-colors"
            title="بازگشت"
          >
            <ArrowRight size={20} />
          </button>
        )}
        <Link to="/" className="text-base lg:text-lg font-bold text-foreground truncate hover:text-primary transition-colors">
          {title}
        </Link>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
          <Calendar size={16} className="text-primary" />
          <span>{currentDate}</span>
        </div>
        
        <div className="relative hidden md:block">
          <input 
            type="text" 
            placeholder="جستجو بر اساس شماره درخواست..." 
            className="bg-secondary text-xs px-4 py-2 rounded-lg w-64 border-none focus:ring-2 focus:ring-primary outline-none pr-10 text-foreground"
          />
          <Search size={16} className="text-muted-foreground absolute right-3 top-2.5" />
        </div>
        
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-secondary text-muted-foreground hover:bg-border transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="hidden sm:block p-2 rounded-lg bg-secondary text-muted-foreground hover:bg-border transition-colors">
          <Bell size={20} />
        </button>

        <button 
          onClick={logout}
          className="lg:hidden p-2 rounded-lg bg-secondary text-destructive hover:bg-destructive/10 transition-colors"
          title="خروج"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
