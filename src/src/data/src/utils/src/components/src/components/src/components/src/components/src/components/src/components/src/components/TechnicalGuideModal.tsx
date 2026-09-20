import React from 'react';
import { X, Code2, Server, Globe, Sparkles, CheckCircle2, Terminal } from 'lucide-react';

interface TechnicalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalGuideModal: React.FC<TechnicalGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">دليل المهندس البرمجي: التقنيات وطريقة التشغيل والرفع المجاني</h3>
              <p className="text-xs text-slate-500">مقارنة الحلول التقنية وخطوات النشر المجاني للسكان</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm leading-relaxed pr-1">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              1. المقارنة الهندسية: ما هي التقنية الأفضل لمشروعك؟
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-emerald-700 text-xs flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  الخيار الأمثل: React + Tailwind
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  <strong>(المعتمد في هذا التطبيق):</strong> تجربة مستخدم فائقة السرعة، استجابة فورية للأجهزة المحمولة وشاشات الهواتف، دعم عربي كامل RTL، مع حفظ فوري بالمتصفح وبدون أي تكلفة استضافة نهائياً.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-blue-700 text-xs flex items-center gap-1 mb-1">
                  <Server className="w-3.5 h-3.5" />
                  Streamlit (بايثون)
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  ممتاز للنماذج الأولية السريعة لتحليل البيانات، لكنه يعاني من إعادة تحميل الصفحة (Rerun) مع كل تفاعل، ودعمه لـ RTL وتخصيص الجداول بالهاتف أقل مرونة من React.
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div className="font-bold text-amber-700 text-xs flex items-center gap-1 mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  HTML/CSS + Firebase
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">
                  حل ممتاز إذا كنت بحاجة لمزامنة آنية بين عدة أجهزة في نفس الثانية مع نظام صلاحيات لكل ساكن، لكنه يتطلب إعداد حساب Google Cloud وتكوين قواعد Firestore.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-blue-600" />
              2. خطوات تشغيل الكود على جهازك الشخصي:
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200 font-sans">
              <li>تأكد من تثبيت بيئة <strong>Node.js</strong> (إصدار 18 أو أحدث) من موقع nodejs.org.</li>
              <li>حمّل مجلد المشروع أو قم بفك ضغطه على جهازك.</li>
              <li>افتح نافذة الأوامر (Terminal أو PowerShell) في مجلد المشروع ونفّذ:</li>
              <pre className="bg-slate-900 text-emerald-400 p-2.5 rounded-lg text-xs font-mono my-1.5 overflow-x-auto" dir="ltr">
npm install
npm run dev
              </pre>
              <li>افتح المتصفح على الرابط المحلي: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-800" dir="ltr">http://localhost:3000</code> وسيعمل التطبيق فوراً.</li>
            </ol>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              3. خطوات الرفع مجاناً 100% على الإنترنت للسكان:
            </h4>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                <strong className="text-emerald-900 block mb-1">أسهل طريقة مجانية: عبر منصة Vercel أو Netlify</strong>
                <p className="leading-normal text-emerald-800">
                  1. ارفع الكود إلى مستودع على <strong>GitHub</strong>.<br />
                  2. سجّل دخول في موقع <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline font-bold">Vercel.com</a> بحساب GitHub.<br />
                  3. اختر <strong>Import Project</strong> ثم اضغط <strong>Deploy</strong>.<br />
                  4. خلال دقيقة واحدة ستحصل على رابط مجاني دائم (مثل: <code className="bg-white/80 px-1 rounded font-mono text-emerald-900">building-24.vercel.app</code>) مع شهادة أمان SSL مجانية، يمكنك إرساله للسكان أو عمل QR Code وتعليقه بمدخل العمارة!
                </p>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            إغلاق الدليل
          </button>
        </div>

      </div>
    </div>
  );
};
