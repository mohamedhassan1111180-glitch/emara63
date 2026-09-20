import React, { useState, useEffect, useCallback } from 'react';
import {
  DEFAULT_CONFIG,
  INITIAL_APARTMENTS,
  loadSavedApartments,
  saveApartments,
  loadSavedConfig,
  saveConfig,
} from './data/initialData';
import { ApartmentData, BuildingConfig } from './types';
import { Navbar } from './components/Navbar';
import { CamerasSection } from './components/CamerasSection';
import { ElectricitySection } from './components/ElectricitySection';
import { WhatsAppModal } from './components/WhatsAppModal';
import { EditResidentModal } from './components/EditResidentModal';
import { SettingsModal } from './components/SettingsModal';
import { TechnicalGuideModal } from './components/TechnicalGuideModal';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [apartments, setApartments] = useState<ApartmentData[]>(() => loadSavedApartments());
  const [config, setConfig] = useState<BuildingConfig>(() => loadSavedConfig());
  const [activeTab, setActiveTab] = useState<'cameras' | 'electricity'>('cameras');

  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTechnicalGuideOpen, setIsTechnicalGuideOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<ApartmentData | null>(null);
  const [saveIndicator, setSaveIndicator] = useState(false);

  useEffect(() => {
    saveApartments(apartments);
    setSaveIndicator(true);
    const timer = setTimeout(() => setSaveIndicator(false), 1200);
    return () => clearTimeout(timer);
  }, [apartments]);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const handleUpdateApartment = useCallback(
    (aptNumber: number, field: keyof ApartmentData, value: any) => {
      setApartments((prev) =>
        prev.map((apt) => (apt.aptNumber === aptNumber ? { ...apt, [field]: value } : apt))
      );
    },
    []
  );

  const handleUpdateConfig = useCallback((newConfig: Partial<BuildingConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const handleResetCycle = useCallback(() => {
    const confirmReset = window.confirm(
      'هل تريد تصفير حالات الدفع لجميع الشقق لبدء دورة شحن جديدة؟ (سيتم الاحتفاظ بأسماء وأرقام السكان والملاحظات)'
    );
    if (confirmReset) {
      setApartments((prev) =>
        prev.map((apt) => ({
          ...apt,
          electricityStatus: 'لم يدفع',
        }))
      );
    }
  }, []);

  const handleResetAllData = useCallback(() => {
    setApartments(INITIAL_APARTMENTS);
    setConfig(DEFAULT_CONFIG);
  }, []);

  const handleSaveResident = useCallback((aptNumber: number, name: string, phone: string) => {
    setApartments((prev) =>
      prev.map((apt) => (apt.aptNumber === aptNumber ? { ...apt, name, phone } : apt))
    );
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Cairo',sans-serif] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onPrint={handlePrint}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        <div className="hidden print-only mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-black">{config.buildingName}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {activeTab === 'cameras' ? 'كشف متابعة مشروع الكاميرات والخدمات' : 'كشف تحصيل كارت كهرباء الخدمات المشتركة'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>

        {activeTab === 'cameras' ? (
          <CamerasSection
            apartments={apartments}
            config={config}
            onUpdateApartment={handleUpdateApartment}
            onEditResident={(apt) => setEditingApartment(apt)}
          />
        ) : (
          <ElectricitySection
            apartments={apartments}
            config={config}
            onUpdateApartment={handleUpdateApartment}
            onUpdateConfig={handleUpdateConfig}
            onEditResident={(apt) => setEditingApartment(apt)}
            onResetCycle={handleResetCycle}
          />
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-4 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{config.buildingName}</span>
            <span>• 24 وحدة سكنية</span>
            {saveIndicator && (
              <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] animate-pulse">
                <CheckCircle2 className="w-3 h-3" />
                تم الحفظ تلقائياً
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsTechnicalGuideOpen(true)}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>دليل التقنيات وطريقة الرفع المجاني للسكان</span>
            </button>
          </div>

        </div>
      </footer>

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        activeTab={activeTab}
        apartments={apartments}
        config={config}
      />

      <EditResidentModal
        isOpen={!!editingApartment}
        onClose={() => setEditingApartment(null)}
        apartment={editingApartment}
        onSave={handleSaveResident}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onResetAllData={handleResetAllData}
      />

      <TechnicalGuideModal
        isOpen={isTechnicalGuideOpen}
        onClose={() => setIsTechnicalGuideOpen(false)}
      />

    </div>
  );
}
