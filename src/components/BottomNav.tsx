import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { LayoutDashboard, FileText, CheckSquare, Package, ShoppingCart, Plus, Users, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

export function BottomNav() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  // Gather accessible links
  const links = [];
  
  links.push({ to: '/', icon: LayoutDashboard, label: 'داشبورد' });
  links.push({ to: '/requests', icon: FileText, label: 'درخواست‌ها' });
  
  if (user.role === 'supervisor' || user.role === 'admin') {
    links.push({ to: '/supervisor', icon: CheckSquare, label: 'سرپرست' });
  }
  if (user.role === 'storekeeper' || user.role === 'admin') {
    links.push({ to: '/warehouse', icon: Package, label: 'انبار' });
  }
  if (user.role === 'purchaser' || user.role === 'admin') {
    links.push({ to: '/purchasing', icon: ShoppingCart, label: 'خرید' });
  }
  if (user.role === 'admin') {
    links.push({ to: '/users', icon: Users, label: 'کاربران' });
    links.push({ to: '/settings', icon: Settings, label: 'تنظیمات' });
  }

  // Split links into right and left sides of the + button
  const half = Math.ceil(links.length / 2);
  const rightLinks = links.slice(0, half);
  const leftLinks = links.slice(half);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 px-2 pb-safe pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between relative">
        
        {/* Right side items */}
        <div className="flex-1 flex flex-wrap justify-center items-center gap-1">
          {rightLinks.map((link, idx) => (
            <NavLink 
              key={idx}
              to={link.to} 
              className={({isActive}) => cn(
                "flex flex-col items-center justify-center p-1.5 gap-1 text-xs transition-colors",
                rightLinks.length > 2 ? "w-[45%]" : "w-16",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon size={20} className={cn(window.location.pathname === link.to && "fill-primary/20")} />
              <span className="text-[9px] font-bold truncate w-full text-center">{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Center + button */}
        <div className="flex-shrink-0 mx-2 -mt-6 self-start">
          <button 
            onClick={() => navigate('/requests', { state: { openNew: true } })}
            className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background transition-transform active:scale-95"
          >
            <Plus size={28} />
          </button>
        </div>

        {/* Left side items */}
        <div className="flex-1 flex flex-wrap justify-center items-center gap-1">
          {leftLinks.map((link, idx) => (
            <NavLink 
              key={idx}
              to={link.to} 
              className={({isActive}) => cn(
                "flex flex-col items-center justify-center p-1.5 gap-1 text-xs transition-colors",
                leftLinks.length > 2 ? "w-[45%]" : "w-16",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon size={20} className={cn(window.location.pathname === link.to && "fill-primary/20")} />
              <span className="text-[9px] font-bold truncate w-full text-center">{link.label}</span>
            </NavLink>
          ))}
        </div>

      </div>
    </div>
  );
}
