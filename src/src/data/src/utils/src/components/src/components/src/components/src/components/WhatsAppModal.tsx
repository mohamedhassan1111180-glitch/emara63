import React, { useState } from 'react';
import { X, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { ApartmentData, BuildingConfig } from '../types';
import { generateWhatsAppReport } from '../utils/exportHelpers';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'cameras' | 'electricity';
  apartments: ApartmentData[];
  config: BuildingConfig;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  activeTab: initialTab,
  apartments,
  config,
}) => {
  const [selectedSection, setSelectedSection] = useState<'cameras' | 'electricity'>(initialTab);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateWhatsAppReport(selectedSection, apartments, config);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تقرير رسالة واتساب للجروب</h3>
              <p className="text-xs text-slate-500">رسالة منسقة جاهزة للإرسال لسكان العمارة بنقرة واحدة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mt-4 text-xs font-bold">
          <button
            onClick={() => setSelectedSection('cameras')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              selectedSection === 'cameras'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تقرير الكاميرات والخدمات
          </button>
          <button
            onClick={() => setSelectedSection('electricity')}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              selectedSection === 'electricity'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تقرير كارت الكهرباء
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
          {reportText}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم النسخ بنجاح! جاهز للصق</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الرسالة (Copy)</span>
              </>
            )}
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>مشاركة مباشرة واتساب</span>
          </button>
        </div>

      </div>
    </div>
  );
};
