import React, { useState } from 'react';
import { BookOpen, FileText, CheckSquare, Package, ShoppingCart, Users, Settings, Search, Printer, Github, Info, Server, Layout } from 'lucide-react';
import { cn } from '../lib/utils';

export function About() {
  const [searchTerm, setSearchTerm] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    {
      id: 'intro',
      title: 'مقدمه و معرفی',
      icon: Info,
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      content: (
        <>
          <p className="text-sm leading-relaxed mb-3">
            سامانه SupplyTrack یک نرم‌افزار تحت وب جامع و فول‌استک برای مدیریت موجودی و تدارکات است که به سازمان شما کمک می‌کند تا فرآیند درخواست تجهیزات، مواد مصرفی و سایر اقلام را از لحظه ثبت تا تحویل یا خرید پیگیری کند. این سیستم باعث شفافیت، سرعت و دقت در تامین نیازهای پرسنل می‌شود.
          </p>
        </>
      )
    },
    {
      id: 'features',
      title: 'ویژگی‌ها',
      icon: Layout,
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      content: (
        <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
          <li><strong>گردش‌کارهای مبتنی بر نقش:</strong> رابط‌های کاربری مجزا برای درخواست‌کننده، سرپرست، انباردار و مسئول خرید.</li>
          <li><strong>داشبوردهای در لحظه:</strong> نمایش نمودارهای روند موجودی و وضعیت درخواست‌ها.</li>
          <li><strong>فیلترینگ سمت کاربر:</strong> جداول با قابلیت جستجوی سریع در کالاها و سوابق موجودی.</li>
          <li><strong>طراحی واکنش‌گرا (Responsive):</strong> رابط کاربری سازگار و بهینه برای استفاده در موبایل و دسکتاپ.</li>
          <li><strong>بومی‌سازی:</strong> استفاده از اعداد فارسی و متون رابط کاربری کاملاً فارسی.</li>
        </ul>
      )
    },
    {
      id: 'architecture',
      title: 'معماری سیستم',
      icon: Server,
      color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
      content: (
        <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
          <li><strong>فرانت‌اند:</strong> React 18, React Router, Tailwind CSS, Recharts</li>
          <li><strong>بک‌اند:</strong> Express.js (همزمان با Vite در محیط توسعه)</li>
          <li><strong>احراز هویت:</strong> مبتنی بر توکن‌های JWT</li>
          <li><strong>مدیریت وضعیت:</strong> React Context API</li>
        </ul>
      )
    },
    {
      id: 'requester',
      title: '۱. درخواست‌کننده (Requester)',
      icon: FileText,
      color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
      content: (
        <>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            هر کاربر می‌تواند درخواست جدیدی ثبت کند. پس از ثبت، درخواست به کارتابل سرپرست ارسال می‌شود. (وضعیت: <em>در انتظار تایید سرپرست</em>)
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
            <li>ثبت درخواست جدید با تعیین نام کالا، واحد و تعداد.</li>
            <li>مشاهده وضعیت درخواست‌ها.</li>
            <li>امکان ویرایش یا حذف درخواست، پیش از تایید سرپرست.</li>
          </ul>
        </>
      )
    },
    {
      id: 'supervisor',
      title: '۲. سرپرست کارگاه (Supervisor)',
      icon: CheckSquare,
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      content: (
        <>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            سرپرست‌ها موظف به بررسی، تایید یا رد درخواست‌های پرسنل زیرمجموعه خود هستند. (وضعیت: <em>در انتظار بررسی انبار</em>)
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
            <li>مشاهده تمامی درخواست‌های در انتظار تایید.</li>
            <li>تایید مقدار درخواستی (تغییر مقدار در صورت نیاز) و ارجاع به انبار.</li>
            <li>رد درخواست و ثبت توضیحات.</li>
          </ul>
        </>
      )
    },
    {
      id: 'storekeeper',
      title: '۳. انباردار (Storekeeper)',
      icon: Package,
      color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
      content: (
        <>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            پس از تایید سرپرست، انباردار موجودی کالاها را بررسی می‌کند.
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
            <li>بررسی موجودی انبار برای اقلام تایید شده.</li>
            <li>در صورت موجود بودن: (وضعیت: <em>آماده تحویل</em>)</li>
            <li>در صورت کسری موجودی، ارسال به لیست خرید: (وضعیت: <em>در حال خرید</em>)</li>
            <li>تحویل اقلام به درخواست‌کننده در تب «آماده تحویل» و ثبت مقادیر تحویلی.</li>
          </ul>
        </>
      )
    },
    {
      id: 'purchaser',
      title: '۴. مسئول خرید (Purchaser)',
      icon: ShoppingCart,
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      content: (
        <>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            اقلامی که انبار کسری داشته در این بخش نمایش داده می‌شوند و مسئول خرید وظیفه تهیه آنها را دارد.
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
            <li>مشاهده اقلام نیازمند خرید.</li>
            <li>ثبت مقدار خریداری شده. این مقادیر مستقیما به انبار تحویل شده و آماده تحویل به درخواست‌کننده می‌شوند.</li>
          </ul>
        </>
      )
    },
    {
      id: 'admin',
      title: '۵. مدیر سیستم (Admin)',
      icon: Users,
      color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      content: (
        <>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            ادمین بالاترین سطح دسترسی را دارد و به تمامی امکانات سیستم، مدیریت کاربران و تنظیمات دسترسی دارد.
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside text-foreground/80">
            <li>نظارت بر تمامی کارتابل‌ها.</li>
            <li>مدیریت کاربران (افزودن، ویرایش، حذف).</li>
            <li>مدیریت تنظیمات و امکان پاکسازی کل داده‌ها جهت شروع مجدد چرخه.</li>
          </ul>
        </>
      )
    }
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (typeof s.content === 'string' && s.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full pb-10">
      
      {/* Sticky Sidebar */}
      <aside className="w-full md:w-64 shrink-0 print:hidden">
        <div className="sticky top-6 bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="font-bold text-lg mb-4 pb-2 border-b border-border flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            فهرست راهنما
          </div>
          <nav className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {sections.map(s => (
              <a 
                key={s.id} 
                href={`#${s.id}`}
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-secondary px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <s.icon size={16} />
                <span className="truncate">{s.title}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-6 min-w-0">
        
        {/* Header & Creator Info */}
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
              <Info size={32} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">درباره سامانه SupplyTrack</h1>
              <p className="text-sm text-muted-foreground mt-2">
                توسعه‌دهنده: <strong className="text-foreground">عرفانی</strong>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a 
              href="https://github.com/mostafa5804/SupplyTrack" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#2c3137] text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors print:hidden"
            >
              <Github size={18} /> گیت‌هاب پروژه
            </a>
            <a 
              href="https://github.com/mostafa5804/SupplyTrack/blob/main/TUTORIAL.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors print:hidden"
            >
              <FileText size={18} /> راهنمای کامل (TUTORIAL.md)
            </a>
            <button 
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors print:hidden"
            >
              <Printer size={18} /> چاپ / PDF
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative print:hidden">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <input 
            type="text"
            placeholder="جستجو در عناوین و موضوعات راهنما..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-card border border-border rounded-xl pl-4 pr-12 py-4 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          />
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <section 
                key={section.id} 
                id={section.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow scroll-mt-24 group relative overflow-hidden"
              >
                {/* Decorative background blur */}
                <div className={cn("absolute -left-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40", section.color.split(' ')[0])} />
                
                <div className="relative flex flex-col sm:flex-row gap-5">
                  <div className={cn("shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", section.color)}>
                    <section.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-4">{section.title}</h3>
                    {section.content}
                  </div>
                </div>
              </section>
            ))
          ) : (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
              موردی یافت نشد.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
