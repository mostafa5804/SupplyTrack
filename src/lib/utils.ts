import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const farsiNum = (str: string | number) => {
  return String(str).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

export const farsiDateLong = () => new Intl.DateTimeFormat("fa-IR", { calendar: "persian", numberingSystem: "arabext", dateStyle: "long" }).format(new Date());

export const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const STATUS_MAP: Record<string, { label: string, icon: string, cls: string }> = {
  registered:            { label: 'ثبت اولیه',        icon: '📝', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  pending_supervisor:    { label: 'در انتظار سرپرست',  icon: '⏳', cls: 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400' },
  approved_supervisor:   { label: 'تأیید سرپرست',      icon: '✅', cls: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400' },
  warehouse_check:       { label: 'بررسی انبار',       icon: '📦', cls: 'bg-sky-100 text-sky-900 dark:bg-sky-900/30 dark:text-sky-400' },
  purchase_list:         { label: 'در لیست خرید',     icon: '🛒', cls: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400' },
  partial_purchase:      { label: 'خرید ناقص',        icon: '🛍️', cls: 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-400' },
  pending_delivery:      { label: 'آماده تحویل',       icon: '🎁', cls: 'bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-400' },
  partial_delivery:      { label: 'نقص در تحویل',      icon: '⚠️', cls: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-400' },
  completed:             { label: 'تحویل نهایی',       icon: '🎯', cls: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-400' },
  rejected:              { label: 'رد شده',           icon: '❌', cls: 'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-400' }
};

export const STATUS_FLOW = [
  'registered',
  'pending_supervisor',
  'approved_supervisor',
  'warehouse_check',
  'purchase_list',
  'pending_delivery',
  'completed'
];
