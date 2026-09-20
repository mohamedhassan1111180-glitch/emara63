import React from 'react';
import { Camera, Zap, MessageSquare, Printer, Settings } from 'lucide-react';
import { BuildingConfig } from '../types';

interface NavbarProps {
  activeTab: 'cameras' | 'electricity';
  setActiveTab: (tab: 'cameras' | 'electricity') => void;
  config: BuildingConfig;
  onOpenSettings: () => void;
  onOpenWhatsApp: () => void;
  onPrint: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenSettings,
  onOpenWhatsApp,
  onPrint,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/15">
              <span className="text-xl font-black font-sans">24</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {config.buildingName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  24 شقة نشطة
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                نظام إدارة الكاميرات والخدمات وكارت الكهرباء • حفظ تلقائي فوري
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
              title="نسخ تقرير رسالة واتساب لجروب العمارة"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>رسالة واتساب للجروب</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              title="طباعة الكشف للتعليق في المدخل"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>طباعة كشف</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
              title="تعديل تكاليف العمارة والمبالغ"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>إعدادات المبالغ</span>
            </button>
          </div>
        </div>

        <div className="flex border-t border-slate-100 -mb-px space-x-reverse space-x-1 sm:space-x-4">
          <button
            onClick={() => setActiveTab('cameras')}
            className={`py-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'cameras'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Camera className={`w-4 h-4 ${activeTab === 'cameras' ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>القسم الأول: نظام الكاميرات والخدمات (الغاز والمياه)</span>
          </button>

          <button
            onClick={() => setActiveTab('electricity')}
            className={`py-3 px-4 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'electricity'
                ? 'border-amber-600 text-amber-700 bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'electricity' ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>القسم الثاني: متابعة شحن كارت الكهرباء</span>
          </button>
        </div>

      </div>
    </header>
  );
};
