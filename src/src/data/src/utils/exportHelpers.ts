import { ApartmentData, BuildingConfig } from '../types';

export function downloadCSV(filename: string, content: string): void {
  const bom = '\uFEFF';
  const blob = new Blob([bom + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCamerasAndServicesCSV(
  apartments: ApartmentData[],
  totalCost: number,
  agreedCount: number,
  perAptCost: number
): void {
  const headers = ['رقم الشقة', 'الاسم', 'رقم التليفون', 'موقف الكاميرات', 'موقف الغاز', 'موقف المياه', 'نصيب الكاميرات (ج.م)'];
  const rows = apartments.map((apt) => [
    apt.aptNumber,
    `"${apt.name.replace(/"/g, '""')}"`,
    `"${apt.phone.replace(/"/g, '""')}"`,
    apt.camerasStatus,
    apt.gasStatus,
    apt.waterStatus,
    apt.camerasStatus === 'موافق' ? perAptCost.toFixed(2) : '0.00',
  ]);

  const summary = [
    [],
    ['ملخص نظام الكاميرات والخدمات'],
    ['إجمالي تكلفة الكاميرات', `${totalCost} ج.م`],
    ['عدد الشقق الموافقة', agreedCount],
    ['نصيب الشقة الواحدة الموافقة', `${perAptCost.toFixed(2)} ج.م`],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(',')),
    ...summary.map((r) => r.join(',')),
  ].join('\r\n');

  downloadCSV(`كشف_الكاميرات_والخدمات_24شقة_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function exportElectricityCSV(
  apartments: ApartmentData[],
  requiredAmount: number,
  perAptDue: number,
  collected: number,
  deficit: number
): void {
  const headers = ['رقم الشقة', 'الاسم', 'رقم التليفون', 'المبلغ المستحق (ج.م)', 'حالة الدفع', 'ملاحظات'];
  const rows = apartments.map((apt) => [
    apt.aptNumber,
    `"${apt.name.replace(/"/g, '""')}"`,
    `"${apt.phone.replace(/"/g, '""')}"`,
    perAptDue.toFixed(2),
    apt.electricityStatus,
    `"${(apt.electricityNotes || '').replace(/"/g, '""')}"`,
  ]);

  const summary = [
    [],
    ['ملخص شحن كارت الكهرباء'],
    ['المبلغ المطلوب الإجمالي للشحن', `${requiredAmount} ج.م`],
    ['المبلغ المستحق على كل شقة (24 شقة)', `${perAptDue.toFixed(2)} ج.م`],
    ['إجمالي المحصل', `${collected.toFixed(2)} ج.م`],
    ['المتبقي / العجز', `${deficit.toFixed(2)} ج.م`],
  ];

  const csvContent = [
    headers.join(','),
    ...rows.map((r) => r.join(',')),
    ...summary.map((r) => r.join(',')),
  ].join('\r\n');

  downloadCSV(`كشف_شحن_كهرباء_العمارة_${new Date().toISOString().slice(0, 10)}.csv`, csvContent);
}

export function generateWhatsAppReport(
  section: 'cameras' | 'electricity',
  apartments: ApartmentData[],
  config: BuildingConfig
): string {
  if (section === 'cameras') {
    const agreedApts = apartments.filter((a) => a.camerasStatus === 'موافق');
    const thinkingApts = apartments.filter((a) => a.camerasStatus === 'قيد التفكير');
    const refusedApts = apartments.filter((a) => a.camerasStatus === 'لا يرغب');
    const perApt = agreedApts.length > 0 ? config.totalCamerasCost / agreedApts.length : 0;

    return `🏢 *تقرير مشروع كاميرات المراقبة والخدمات - ${config.buildingName}*
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}

📊 *البيانات المالية:*
• إجمالي تكلفة المنظومة: *${config.totalCamerasCost.toLocaleString('ar-EG')} ج.م*
• عدد الشقق الموافقة: *${agreedApts.length} من 24 شقة*
• نصيب الشقة الواحدة حالياً: *${perApt.toFixed(2)} ج.م*

✅ *الشقق الموافقة (${agreedApts.length}):*
${agreedApts.map((a) => `• شقة ${a.aptNumber} (${a.name})`).join('\n')}

⏳ *قيد التفكير (${thinkingApts.length}):*
${thinkingApts.map((a) => `• شقة ${a.aptNumber} (${a.name})`).join('\n') || 'لا يوجد'}

❌ *غير راغبين (${refusedApts.length}):*
${refusedApts.map((a) => `• شقة ${a.aptNumber} (${a.name})`).join('\n') || 'لا يوجد'}

يرجى من السادة السكان في خانة (قيد التفكير) سرعة التأكيد حتى يتسنى حسم نصيب كل شقة والبدء في التركيب. شكراً لتعاونكم! 🙏`;
  } else {
    const perAptDue = config.requiredElectricityAmount / 24;
    const paidApts = apartments.filter((a) => a.electricityStatus === 'تم الدفع');
    const unpaidApts = apartments.filter((a) => a.electricityStatus === 'لم يدفع');
    const totalCollected = paidApts.length * perAptDue;
    const deficit = config.requiredElectricityAmount - totalCollected;

    return `⚡ *تقرير تحصيل شحن كارت كهرباء الخدمات - ${config.buildingName}*
📅 التاريخ: ${new Date().toLocaleDateString('ar-EG')}

💰 *الحسابات المالية:*
• المبلغ المطلوب للشحن: *${config.requiredElectricityAmount.toLocaleString('ar-EG')} ج.م*
• المبلغ المستحق على كل شقة: *${perAptDue.toFixed(2)} ج.م*
• إجمالي المحصل (${paidApts.length} شقة): *${totalCollected.toFixed(2)} ج.م*
• المتبقي لإتمام الشحن (${unpaidApts.length} شقة): *${deficit.toFixed(2)} ج.م*

✅ *تم الدفع (${paidApts.length} شقة):*
${paidApts.map((a) => `• شقة ${a.aptNumber}: ${a.name}`).join('\n')}

⚠️ *المتبقي عليهم الدفع (${unpaidApts.length} شقة):*
${unpaidApts.map((a) => `• شقة ${a.aptNumber}: ${a.name} ${a.electricityNotes ? `(${a.electricityNotes})` : ''}`).join('\n')}

نرجو من الجيران الكرام سرعة السداد لإتمام عملية الشحن للخدمات والمصعد والإنارة. دمتم بخير 🌸`;
  }
      }
