import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useSettings } from '../store/SettingsContext';
import { LayoutDashboard, FileText, CheckSquare, Package, ShoppingCart, LogOut, Users, X, Settings, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  if (!user) return null;

  return (
    <aside className="print:hidden w-64 bg-card border-l border-border flex flex-col z-10 shrink-0 shadow-sm h-screen overflow-y-auto">
      <div className="p-4 lg:p-6 flex items-center justify-between border-b border-border sticky top-0 bg-card z-20">
        <div className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img src={settings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-lg bg-white" />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">{settings.projectName.charAt(0)}</div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-foreground leading-none">{settings.projectName}</span>
            <span className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">{settings.companyName}</span>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-2 text-muted-foreground hover:bg-secondary rounded-lg">
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-muted-foreground mb-2 mr-2">بخش‌های اصلی</div>
        <NavLink onClick={onClose} to="/" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
          <LayoutDashboard size={20} /> داشبورد اصلی
        </NavLink>
        
        {(user.role === 'requester' || user.role === 'admin') && (
          <NavLink onClick={onClose} to="/requests" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
            <FileText size={20} /> درخواست‌ها
          </NavLink>
        )}

        {(user.role === 'supervisor' || user.role === 'admin') && (
          <NavLink onClick={onClose} to="/supervisor" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
            <CheckSquare size={20} /> تأیید سرپرست
          </NavLink>
        )}

        {(user.role === 'storekeeper' || user.role === 'admin') && (
          <NavLink onClick={onClose} to="/warehouse" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
            <Package size={20} /> انبار
          </NavLink>
        )}

        {(user.role === 'purchaser' || user.role === 'admin') && (
          <NavLink onClick={onClose} to="/purchasing" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
            <ShoppingCart size={20} /> لیست خرید
          </NavLink>
        )}

        {(user.role === 'admin' || user.role === 'supervisor') && (
          <>
            <NavLink onClick={onClose} to="/users" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
              <Users size={20} /> کاربران
            </NavLink>
            <NavLink onClick={onClose} to="/settings" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
              <Settings size={20} /> تنظیمات سامانه
            </NavLink>
          </>
        )}
        <div className="text-[10px] font-bold text-muted-foreground mt-4 mb-2 mr-2">راهنما</div>
        <NavLink onClick={onClose} to="/about" className={({isActive}) => cn("flex items-center gap-3 p-2.5 rounded-lg transition-all text-sm font-medium", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground")}>
          <BookOpen size={20} /> درباره برنامه
        </NavLink>
      </nav>

      <div className="p-4 bg-muted border-t border-border mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{user.name.charAt(0)}</div>
            <div className="flex flex-col text-xs overflow-hidden">
              <span className="font-bold truncate">{user.name}</span>
              <span className="text-muted-foreground truncate">{user.role}</span>
            </div>
          </div>
          <button onClick={logout} className="text-muted-foreground hover:text-destructive p-2 rounded-lg transition-colors shrink-0">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
