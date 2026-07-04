import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export function Layout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground print:overflow-visible print:h-auto print:block">
      <div className="hidden lg:block fixed inset-y-0 right-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:overflow-visible print:h-auto print:block">
        <Topbar />
        
        <main className="p-4 lg:p-6 overflow-y-auto flex-1 flex flex-col w-full pb-24 lg:pb-6 print:overflow-visible print:p-0 print:block">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
