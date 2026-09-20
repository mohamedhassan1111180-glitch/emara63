import React, { useState, useMemo } from 'react';
import { Camera, Flame, Droplets, Users, Search, Download, UserCheck, AlertCircle, PhoneCall, Edit2 } from 'lucide-react';
import { ApartmentData, CamerasStatus, ServiceStatus, BuildingConfig } from '../types';
import { exportCamerasAndServicesCSV } from '../utils/exportHelpers';

interface CamerasSectionProps {
  apartments: ApartmentData[];
  config: BuildingConfig;
  onUpdateApartment: (aptNumber: number, field: keyof ApartmentData, value: any) => void;
  onEditResident: (apartment: ApartmentData) => void;
}

export const CamerasSection: React.FC<CamerasSectionProps> = ({
  apartments,
  config,
  onUpdateApartment,
  onEditResident,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cameraFilter, setCameraFilter] = useState<'all' | CamerasStatus>('all');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'gas_submitted' | 'water_submitted'>('all');

  const totalCost = config.totalCamerasCost;
  const agreedApartments = useMemo(() => apartments.filter((a) => a.camerasStatus === 'موافق'), [apartments]);
  const thinkingApartments = useMemo(() => apartments.filter((a) => a.camerasStatus === 'قيد التفكير'), [apartments]);
  const refusedApartments = useMemo(() => apartments.filter((a) => a.camerasStatus === 'لا يرغب'), [apartments]);
  
  const agreedCount = agreedApartments.length;
  const thinkingCount = thinkingApartments.length;
  const refusedCount = refusedApartments.length;

  const costPerAgreedApartment = agreedCount > 0 ? totalCost / agreedCount : 0;

  const gasSubmittedCount = useMemo(() => apartments.filter((a) => a.gasStatus === 'قدم').length, [apartments]);
  const waterSubmittedCount = useMemo(() => apartments.filter((a) => a.waterStatus === 'قدم').length, [apartments]);

  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      const matchesSearch =
        apt.aptNumber.toString().includes(searchQuery.trim()) ||
        apt.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        apt.phone.includes(searchQuery.trim());

      const matchesCamera = cameraFilter === 'all' || apt.camerasStatus === cameraFilter;

      let matchesService = true;
      if (serviceFilter === 'gas_submitted') {
        matchesService = apt.gasStatus === 'قدم';
      } else if (serviceFilter === 'water_submitted') {
        matchesService = apt.waterStatus === 'قدم';
      }

      return matchesSearch && matchesCamera && matchesService;
    });
  }, [apartments, searchQuery, cameraFilter, serviceFilter]);

  const handleExportCSV = () => {
    exportCamerasAndServicesCSV(apartments, totalCost, agreedCount, costPerAgreedApartment);
  };

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              إجمالي تكلفة الكاميرات
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCost.toLocaleString('ar-EG')} <span className="text-sm font-semibold text-slate-500">ج.م</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              تكلفة ثابتة للمنظومة بالكامل
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span>24 شقة بالعمارة</span>
            <span className="text-blue-600 font-bold">100% تغطية</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              عدد الشقق الموافقة
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
                {agreedCount}
              </span>
              <span className="text-sm font-semibold text-slate-500">من أصل 24 شقة</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(agreedCount / 24) * 100}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
            <span className="text-amber-600 font-semibold">{thinkingCount} قيد التفكير</span>
            <span className="text-rose-600 font-semibold">{refusedCount} لا يرغب</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-xl p-5 text-white shadow-md shadow-blue-700/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wide">
              نصيب الشقة الواحدة
            </span>
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {agreedCount > 0 ? (
                <>
                  {costPerAgreedApartment.toFixed(2)}{' '}
                  <span className="text-sm font-bold text-blue-200">ج.م</span>
                </>
              ) : (
                <span className="text-lg font-bold text-amber-200">بانتظار موافقات</span>
              )}
            </div>
            <p className="text-xs text-blue-100/90 mt-1">
              المعادلة: 18,500 ÷ {agreedCount || 1} شقة موافقة
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <span>تحديث فوري تلقائي</span>
            <span className="font-bold bg-white/20 px-2 py-0.5 rounded text-white">
              {agreedCount > 0 ? `إجمالي: ${(costPerAgreedApartment * agreedCount).toLocaleString('ar-EG')} ج.م` : '0 ج.م'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              موقف الغاز والمياه
            </span>
            <div className="flex gap-1">
              <div className="w-7 h-7 rounded-md bg-orange-50 text-orange-600 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div className="w-7 h-7 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                تقديم الغاز:
              </span>
              <span className="text-sm font-bold text-slate-900">
                {gasSubmittedCount} <span className="text-xs font-normal text-slate-500">من 24</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                تقديم المياه:
              </span>
              <span className="text-sm font-bold text-slate-900">
                {waterSubmittedCount} <span className="text-xs font-normal text-slate-500">من 24</span>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>لم يقدم غاز: {24 - gasSubmittedCount}</span>
            <span>لم يقدم مياه: {24 - waterSubmittedCount}</span>
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
              placeholder="بحث برقم الشقة، الاسم، أو التليفون..."
              className="w-full pr-9 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all"
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

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>تصدير كشف الكاميرات لإكسيل (CSV)</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-bold text-slate-500 ml-1">تصفية حسب موقف الكاميرات:</span>
          
          <button
            onClick={() => setCameraFilter('all')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              cameraFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل (24)
          </button>

          <button
            onClick={() => setCameraFilter('موافق')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              cameraFilter === 'موافق'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            موافق ({agreedCount})
          </button>

          <button
            onClick={() => setCameraFilter('قيد التفكير')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              cameraFilter === 'قيد التفكير'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            قيد التفكير ({thinkingCount})
          </button>

          <button
            onClick={() => setCameraFilter('لا يرغب')}
            className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
              cameraFilter === 'لا يرغب'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            لا يرغب ({refusedCount})
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
                <th className="py-3 px-4 min-w-[130px]">رقم التليفون</th>
                <th className="py-3 px-4 min-w-[160px]">موقف الكاميرات (18,500 ج)</th>
                <th className="py-3 px-4 min-w-[130px]">نصيب الشقة</th>
                <th className="py-3 px-4 min-w-[140px]">موقف الغاز</th>
                <th className="py-3 px-4 min-w-[140px]">موقف المياه</th>
                <th className="py-3 px-3 text-center w-20">تعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredApartments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-slate-400" />
                      <p className="font-semibold text-slate-700">لم يتم العثور على شقق مطابقة للبحث</p>
                      <button
                        onClick={() => { setSearchQuery(''); setCameraFilter('all'); }}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        إعادة ضبط الفلاتر
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredApartments.map((apt) => {
                  const isAgreed = apt.camerasStatus === 'موافق';
                  const isThinking = apt.camerasStatus === 'قيد التفكير';

                  return (
                    <tr
                      key={apt.aptNumber}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3 px-4 text-center font-bold text-slate-900">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black">
                          {apt.aptNumber}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{apt.name}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 text-xs font-mono" dir="ltr">
                        {apt.phone ? (
                          <a
                            href={`tel:${apt.phone}`}
                            className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
                            title="اتصال"
                          >
                            <PhoneCall className="w-3 h-3 text-slate-400" />
                            <span>{apt.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="relative inline-block w-full max-w-[150px]">
                          <select
                            value={apt.camerasStatus}
                            onChange={(e) =>
                              onUpdateApartment(apt.aptNumber, 'camerasStatus', e.target.value as CamerasStatus)
                            }
                            className={`w-full py-1.5 px-2.5 text-xs font-bold rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 transition-colors ${
                              isAgreed
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-400'
                                : isThinking
                                ? 'bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-400'
                                : 'bg-slate-100 text-slate-700 border-slate-300 focus:ring-slate-400'
                            }`}
                          >
                            <option value="موافق">موافق ✅</option>
                            <option value="قيد التفكير">قيد التفكير ⏳</option>
                            <option value="لا يرغب">لا يرغب ❌</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-xs">
                        {isAgreed ? (
                          <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                            {costPerAgreedApartment.toFixed(2)} ج.م
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs font-normal">
                            {isThinking ? 'مؤجل للقرار' : 'غير مشارك'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={apt.gasStatus}
                          onChange={(e) =>
                            onUpdateApartment(apt.aptNumber, 'gasStatus', e.target.value as ServiceStatus)
                          }
                          className={`py-1.5 px-2.5 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 transition-colors ${
                            apt.gasStatus === 'قدم'
                              ? 'bg-orange-50 text-orange-800 border-orange-200 focus:ring-orange-400'
                              : 'bg-slate-50 text-slate-500 border-slate-200 focus:ring-slate-300'
                          }`}
                        >
                          <option value="قدم">قدم 🔥</option>
                          <option value="لم يقدم">لم يقدم</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={apt.waterStatus}
                          onChange={(e) =>
                            onUpdateApartment(apt.aptNumber, 'waterStatus', e.target.value as ServiceStatus)
                          }
                          className={`py-1.5 px-2.5 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 transition-colors ${
                            apt.waterStatus === 'قدم'
                              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 focus:ring-cyan-400'
                              : 'bg-slate-50 text-slate-500 border-slate-200 focus:ring-slate-300'
                          }`}
                        >
                          <option value="قدم">قدم 💧</option>
                          <option value="لم يقدم">لم يقدم</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => onEditResident(apt)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          title="تعديل الاسم أو رقم التليفون"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              إجمالي الموافقين للكاميرات: <strong className="text-emerald-700">{agreedCount}</strong> من 24
            </span>
            <span>
              نصيب الشقة الواحدة: <strong className="text-blue-700">{costPerAgreedApartment.toFixed(2)} ج.م</strong>
            </span>
          </div>
          <div className="text-slate-500">
            تحديث الحسابات يتم لحظياً عند تغيير أي قائمة منسدلة
          </div>
        </div>

      </div>

    </div>
  );
};
