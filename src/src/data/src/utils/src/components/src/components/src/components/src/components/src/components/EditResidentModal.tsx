import React, { useState, useEffect } from 'react';
import { X, User, Phone, Check } from 'lucide-react';
import { ApartmentData } from '../types';

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartment: ApartmentData | null;
  onSave: (aptNumber: number, name: string, phone: string) => void;
}

export const EditResidentModal: React.FC<EditResidentModalProps> = ({
  isOpen,
  onClose,
  apartment,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (apartment) {
      setName(apartment.name);
      setPhone(apartment.phone);
    }
  }, [apartment]);

  if (!isOpen || !apartment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(apartment.aptNumber, name.trim() || `ساكن شقة ${apartment.aptNumber}`, phone.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              {apartment.aptNumber}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">تعديل بيانات الشقة رقم {apartment.aptNumber}</h3>
              <p className="text-xs text-slate-500">تحديث اسم الساكن ورقم الهاتف للتواصل</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم الساكن / المالك:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اسم الساكن بالكامل..."
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم الهاتف (واتساب / اتصال):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01012345678"
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-mono text-right"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>حفظ البيانات</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
