import React from 'react';
import { BookOpen, FileText, CheckSquare, Package, ShoppingCart, Users, Settings, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export function Help() {
  return (
    <div className="flex-1 flex flex-col space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full pb-10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">راهنمای سیستم SupplyTrack</h1>
          <p className="text-sm text-muted-foreground mt-1">آموزش جامع استفاده از سامانه درخواست و تحویل کالا</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-4 lg:p-6 shadow-sm">
        <p className="text-sm leading-relaxed mb-6">
          این سامانه جهت مکانیزه کردن فرآیند درخواست کالا از انبار، تاییدات لازم و در نهایت تحویل یا خرید کالا طراحی شده است. در ادامه، وظایف و دسترسی‌های هر یک از نقش‌های سیستم شرح داده شده است.
        </p>

        <div className="space-y-6 lg:space-y-8">
          
          {/* Requester */}
          <section className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">۱. درخواست‌کننده</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                هر کاربر می‌تواند درخواست جدیدی ثبت کند. پس از ثبت، درخواست به کارتابل سرپرست ارسال می‌شود.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                <li>ثبت درخواست جدید با تعیین نام کالا، واحد و تعداد.</li>
                <li>مشاهده وضعیت درخواست‌ها (در انتظار تایید، بررسی انبار، تحویل و...).</li>
                <li>امکان ویرایش یا حذف درخواست، <span className="font-bold text-destructive">فقط</span> پیش از تایید سرپرست.</li>
              </ul>
            </div>
          </section>

          <hr className="border-border" />

          {/* Supervisor */}
          <section className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <CheckSquare size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">۲. سرپرست</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                سرپرست‌ها موظف به بررسی، تایید یا رد درخواست‌های ثبت شده هستند.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                <li>مشاهده تمامی درخواست‌های در انتظار تایید.</li>
                <li>تایید مقدار درخواستی (تغییر مقدار در صورت نیاز) و ارجاع به انبار.</li>
                <li>رد کلی درخواست در صورت عدم تایید.</li>
                <li>ثبت توضیحات (مثلا دلیل کاهش مقدار).</li>
              </ul>
            </div>
          </section>

          <hr className="border-border" />

          {/* Warehouse */}
          <section className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-12 h-12 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">۳. انباردار</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                پس از تایید سرپرست، انباردار موجودی کالاها را بررسی می‌کند.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                <li>بررسی موجودی انبار برای اقلام تایید شده.</li>
                <li>ثبت مقدار قابل تامین از انبار. کسری اقلام به صورت خودکار به لیست خرید منتقل می‌شود.</li>
                <li>تحویل اقلام به درخواست‌کننده در تب «آماده تحویل». در این مرحله می‌توان به صورت جزئی یا کلی کالا را تحویل داد.</li>
              </ul>
            </div>
          </section>

          <hr className="border-border" />

          {/* Purchaser */}
          <section className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">۴. مامور خرید</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                اقلامی که در انبار موجود نباشند، به کارتابل خرید منتقل می‌شوند.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                <li>مشاهده اقلامی که نیاز به خریداری دارند.</li>
                <li>ثبت مقدار خریداری شده. این مقادیر مستقیما به انبار تحویل شده و آماده تحویل به درخواست‌کننده می‌شوند.</li>
              </ul>
            </div>
          </section>

          <hr className="border-border" />

          {/* Admin */}
          <section className="flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-2">۵. ادمین (مدیر سیستم)</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                ادمین بالاترین سطح دسترسی را دارد و به تمامی امکانات سیستم احاطه دارد.
              </p>
              <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
                <li>دسترسی به تمامی کارتابل‌ها (سرپرست، انبار، خرید) جهت نظارت یا انجام کار.</li>
                <li>مدیریت کاربران (افزودن، ویرایش، حذف و تغییر نقش کاربران).</li>
                <li>دسترسی به بخش تنظیمات سیستم جهت تغییر لوگو و نام پروژه.</li>
              </ul>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
