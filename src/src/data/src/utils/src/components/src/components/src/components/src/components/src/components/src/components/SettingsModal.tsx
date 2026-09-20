import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check, Building2, Camera, Zap, AlertTriangle } from 'lucide-react';
import { BuildingConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BuildingConfig;
  onSaveConfig: (newConfig: BuildingConfig) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetAllData,
}) => {
  const [buildingName, setBuildingName] = useState(config.buildingName);
  const [totalCamerasCost, setTotalCamerasCost] = useState(config.totalCamerasCost.toString());
  const [requiredElectricityAmount, setRequiredElectricityAmount] = useState(
    config.requiredElectricityAmount.toString()
  );
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camCost = parseFloat(totalCamerasCost);
    const elecCost = parseFloat(requiredElectricityAmount);

    onSaveConfig({
      ...config,
      buildingName: buildingName.trim() || 'عمارة سكنية (24 شقة)',
      totalCamerasCost: !isNaN(camCost) && camCost > 0 ? camCost : 18500,
      requiredElectricityAmount: !isNaN(elecCost) && elecCost > 0 ? elecCost : 1000,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">إعدادات العمارة والمبالغ</h3>
              <p className="text-xs text-slate-500">تعديل التكاليف الثابتة ومبالغ كروت الشحن</p>
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
              اسم العمارة / العنوان:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="مثال: عمارة رقم 14 - شارع النصر"
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              إجمالي تكلفة منظومة الكاميرات (ج.م):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Camera className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="any"
                required
                value={totalCamerasCost}
                onChange={(e) => setTotalCamerasCost(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              المبلغ الافتراضي المحدد في دراستك: 18,500 ج.م
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              مبلغ شحن كارت الكهرباء الإجمالي (ج.م):
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <Zap className="w-4 h-4" />
              </div>
              <input
                type="number"
                step="any"
                required
                value={requiredElectricityAmount}
                onChange={(e) => setRequiredElectricityAmount(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              المبلغ الافتراضي: 1,000 ج.م (يقسم على 24 شقة بالتساوي)
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowConfirmReset(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>استعادة البيانات الافتراضية</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </button>
            </div>
          </div>

        </form>

        {showConfirmReset && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-rose-800 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>هل تريد بالتأكيد إعادة ضبط جميع البيانات؟</span>
            </div>
            <p className="text-rose-700">
              سيتم استعادة الأسماء والحالات الافتراضية لجميع الـ 24 شقة وإعادة تعيين المبالغ.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-2.5 py-1 text-slate-600 hover:bg-rose-100 rounded cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setShowConfirmReset(false);
                  onClose();
                }}
                className="px-3 py-1 bg-rose-600 text-white font-bold rounded hover:bg-rose-700 cursor-pointer"
              >
                نعم، إعادة الضبط
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
