import React, { useState, useMemo } from 'react';
import { Zap, CheckCircle2, Clock, DollarSign, Wallet, AlertCircle, Search, Download, RotateCcw, Check, Edit2 } from 'lucide-react';
import { ApartmentData, ElectricityPaymentStatus, BuildingConfig } from '../types';
import { exportElectricityCSV } from '../utils/exportHelpers';

interface ElectricitySectionProps {
  apartments: ApartmentData[];
  config: BuildingConfig;
  onUpdateApartment: (aptNumber: number, field: keyof ApartmentData, value: any) => void;
  onUpdateConfig: (newConfig: Partial<BuildingConfig>) => void;
  onEditResident: (apartment: ApartmentData) => void;
  onResetCycle: () => void;
}

export const ElectricitySection: React.FC<ElectricitySectionProps> = ({
  apartments,
  config,
  onUpdateApartment,
  onUpdateConfig,
  onEditResident,
  onResetCycle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ElectricityPaymentStatus>('all');
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempAmount, setTempAmount] = useState(config.requiredElectricityAmount.toString());

  const requiredAmount = config.requiredElectricityAmount;
  const perApartmentDue = requiredAmount / 24;

  const paidApartments = useMemo(() => apartments.filter((a) => a.electricityStatus === 'تم الدفع'), [apartments]);
  const unpaidApartments = useMemo(() => apartments.filter((a) => a.electricityStatus === 'لم يدفع'), [apartments]);

  const paidCount = paidApartments.length;
  const unpaidCount = unpaidApartments.length;

  const totalCollected = paidCount * perApartmentDue;
  const deficitOrRemaining = Math.max(0, requiredAmount - totalCollected);
  const percentCollected = requiredAmount > 0 ? (totalCollected / requiredAmount) * 100 : 0;

  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      const matchesSearch =
        apt.aptNumber.toString().includes(searchQuery.trim()) ||
        apt.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (apt.electricityNotes && apt.electricityNotes.toLowerCase().includes(searchQuery.toLowerCase().trim()));

      const matchesStatus = statusFilter === 'all' || apt.electricityStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [apartments, searchQuery, statusFilter]);

  const handleSaveTargetAmount = () => {
    const parsed = parseFloat(tempAmount);
    if (!isNaN(parsed) && parsed > 0) {
      onUpdateConfig({ requiredElectricityAmount: parsed });
      setIsEditingTarget(false);
    }
  };

  const handleExportCSV = () => {
    exportElectricityCSV(apartments, requiredAmount, perApartmentDue, totalCollected, deficitOrRemaining);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              المبلغ المطلوب للشحن
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            {isEditingTarget ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={tempAmount}
                  onChange={(e) => setTempAmount(e.target.value)}
                  className="w-28 px-2 py-1 text-lg font-bold border border-blue-400 rounded-lg focus:outline-hidden"
                  autoFocus
                />
                <button
                  onClick={handleSaveTargetAmount}
                  className="p-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
                >
                  حفظ
                </button>
                <button
                  onClick={() => { setTempAmount(config.requiredElectricityAmount.toString()); setIsEditingTarget(false); }}
                  className="p-1.5 text-slate-500 text-xs hover:text-slate-800 cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {requiredAmount.toLocaleString('ar-EG')} <span className="text-sm font-semibold text-slate-500">ج.م</span>
                </div>
                <button
                  onClick={() => { setTempAmount(requiredAmount.toString()); setIsEditingTarget(true); }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  تعديل المبلغ
                </button>
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">
              مبلغ كارت الكهرباء للخدمات المشتركة
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>المبلغ قابل للتعديل</span>
            <span className="text-amber-600 font-bold">24 شقة</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              المبلغ المستحق على كل شقة
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
              {perApartmentDue.toFixed(2)} <span className="text-sm font-semibold text-slate-500">ج.م</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              المعادلة: {requiredAmount.toLocaleString('ar-EG')} ÷ 24 شقة بالتساوي
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>تم الدفع: {paidCount} شقة</span>
            <span>لم يدفع: {unpaidCount} شقة</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              إجمالي المحصل
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {totalCollected.toFixed(2)} <span className="text-sm font-semibold text-slate-500">ج.م</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, percentCollected)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>نسبة التحصيل: {percentCollected.toFixed(1)}%</span>
            <span className="text-emerald-700 font-bold">{paidCount} من 24 دفعوا</span>
          </div>
        </div>

        <div
          className={`rounded-xl p-5 border shadow-xs flex flex-col justify-between transition-colors ${
            deficitOrRemaining === 0
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              العجز / المتبقي للتحصيل
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                deficitOrRemaining === 0
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {deficitOrRemaining === 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
          </div>

          <div className="mt-3">
            <div
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                deficitOrRemaining === 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {deficitOrRemaining.toFixed(2)} <span className="text-sm font-semibold text-slate-500">ج.م</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              المعادلة: المبلغ المطلوب - إجمالي المحصل
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            {deficitOrRemaining === 0 ? (
              <span className="text-emerald-700 font-bold">اكتمل المبلغ بنجاح! جاهز للشحن</span>
            ) : (
              <>
                <span className="text-rose-600">باقي {unpaidCount} شقق لم تدفع</span>
                <span className="text-slate-500">نصيب كل شقة: {perApartmentDue.toFixed(2)} ج.م</span>
              </>
            )}
          </div>
        </div>

      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث برقم الشقة، الاسم، أو الملاحظة..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تصدير كشف الكهرباء إكسيل</span>
            </button>

            <button
              onClick={onResetCycle}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
              title="تصفير حالات الدفع لدورة شحن شهر جديد مع بقاء الأسماء"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>دورة شحن جديدة (تصفير الدفع)</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 ml-1">تصفية حسب حالة الدفع:</span>

          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل (24)
          </button>

          <button
            onClick={() => setStatusFilter('تم الدفع')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              statusFilter === 'تم الدفع'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            تم الدفع ({paidCount})
          </button>

          <button
            onClick={() => setStatusFilter('لم يدفع')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              statusFilter === 'لم يدفع'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            لم يدفع ({unpaidCount})
          </button>

          <div className="mr-auto text-slate-400 text-xs">
            عرض {filteredApartments.length} من 24 شقة
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-600">
                <th className="py-3 px-4 w-16 text-center">رقم الشقة</th>
                <th className="py-3 px-4 min-w-[160px]">اسم الساكن</th>
                <th className="py-3 px-4 min-w-[130px]">المبلغ المستحق</th>
                <th className="py-3 px-4 min-w-[150px]">حالة الدفع</th>
                <th className="py-3 px-4 min-w-[220px]">ملاحظات السداد والتواصل</th>
                <th className="py-3 px-4 text-center min-w-[120px]">تبديل سريع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredApartments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                      <p className="font-semibold text-slate-700">لم يتم العثور على شقق مطابقة للبحث</p>
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        إعادة ضبط الفلاتر
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApartments.map((apt) => {
                  const isPaid = apt.electricityStatus === 'تم الدفع';

                  return (
                    <tr
                      key={apt.aptNumber}
                      className={`transition-colors ${
                        isPaid ? 'hover:bg-slate-50/70' : 'bg-rose-50/20 hover:bg-rose-50/40'
                      }`}
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black border ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {apt.aptNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{apt.name}</p>
                            {apt.phone && (
                              <p className="text-xs text-slate-400 font-mono" dir="ltr">
                                {apt.phone}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => onEditResident(apt)}
                            className="p-1 text-slate-300 hover:text-blue-600 rounded transition-colors cursor-pointer"
                            title="تعديل الاسم أو رقم الهاتف"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        <span className="text-sm font-extrabold text-blue-700">
                          {perApartmentDue.toFixed(2)}
                        </span>{' '}
                        <span className="text-xs font-normal text-slate-500">ج.م</span>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={apt.electricityStatus}
                          onChange={(e) =>
                            onUpdateApartment(apt.aptNumber, 'electricityStatus', e.target.value as ElectricityPaymentStatus)
                          }
                          className={`w-full max-w-[140px] py-1.5 px-2.5 text-xs font-bold rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 transition-colors ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400'
                              : 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-400'
                          }`}
                        >
                          <option value="تم الدفع">تم الدفع ✅</option>
                          <option value="لم يدفع">لم يدفع ❌</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={apt.electricityNotes || ''}
                          onChange={(e) =>
                            onUpdateApartment(apt.aptNumber, 'electricityNotes', e.target.value)
                          }
                          placeholder="مثال: سيدفع غداً، فودافون كاش، تم التحويل..."
                          className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-500 text-slate-800 placeholder:text-slate-400 transition-colors"
                        />
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() =>
                            onUpdateApartment(
                              apt.aptNumber,
                              'electricityStatus',
                              isPaid ? 'لم يدفع' : 'تم الدفع'
                            )
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                            isPaid
                              ? 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                              : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                          }`}
                        >
                          {isPaid ? (
                            <span>إلغاء الدفع</span>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تسجيل دفع</span>
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-4 flex-wrap font-medium">
            <span>
              إجمالي المحصل: <strong className="text-emerald-700">{totalCollected.toFixed(2)} ج.م</strong>
            </span>
            <span>
              المتبقي لإتمام الشحن: <strong className="text-rose-600">{deficitOrRemaining.toFixed(2)} ج.م</strong>
            </span>
          </div>
          <div className="text-slate-500">
            يتم حفظ الملاحظات وحالات السداد تلقائياً في المتصفح
          </div>
        </div>

      </div>

    </div>
  );
};
