import { ApartmentData, BuildingConfig } from '../types';

export const DEFAULT_CONFIG: BuildingConfig = {
  buildingName: 'عمارة سكنية (24 شقة)',
  totalCamerasCost: 18500,
  requiredElectricityAmount: 1000,
  electricityPeriod: 'دورة شحن كارت الكهرباء الحالية',
};

export const INITIAL_APARTMENTS: ApartmentData[] = [
  { aptNumber: 1, name: 'أحمد محمود', phone: '01012345601', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 2, name: 'محمد إبراهيم', phone: '01012345602', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 3, name: 'طارق عبد الله', phone: '01012345603', camerasStatus: 'قيد التفكير', gasStatus: 'قدم', waterStatus: 'لم يقدم', electricityStatus: 'لم يدفع', electricityNotes: 'سيدفع غداً' },
  { aptNumber: 4, name: 'محمود حسن', phone: '01012345604', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 5, name: 'عصام علي', phone: '01012345605', camerasStatus: 'لا يرغب', gasStatus: 'لم يقدم', waterStatus: 'لم يقدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 6, name: 'كريم مصطفى', phone: '01012345606', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 7, name: 'ياسر سعيد', phone: '01012345607', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'لم يدفع', electricityNotes: '' },
  { aptNumber: 8, name: 'خالد عمر', phone: '01012345608', camerasStatus: 'قيد التفكير', gasStatus: 'قدم', waterStatus: 'لم يقدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 9, name: 'حسين شاكر', phone: '01012345609', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 10, name: 'عمرو فؤاد', phone: '01012345610', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'لم يدفع', electricityNotes: 'مسافر حتى الإثنين' },
  { aptNumber: 11, name: 'سامي وجدي', phone: '01012345611', camerasStatus: 'لا يرغب', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 12, name: 'أيمن صلاح', phone: '01012345612', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 13, name: 'هاني كمال', phone: '01012345613', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'لم يدفع', electricityNotes: '' },
  { aptNumber: 14, name: 'شريف نبيل', phone: '01012345614', camerasStatus: 'قيد التفكير', gasStatus: 'لم يقدم', waterStatus: 'لم يقدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 15, name: 'ماجد سامي', phone: '01012345615', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 16, name: 'إسلام فاروق', phone: '01012345616', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 17, name: 'وليد عادل', phone: '01012345617', camerasStatus: 'لا يرغب', gasStatus: 'قدم', waterStatus: 'لم يقدم', electricityStatus: 'لم يدفع', electricityNotes: '' },
  { aptNumber: 18, name: 'مصطفى كمال', phone: '01012345618', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 19, name: 'أشرف ممدوح', phone: '01012345619', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 20, name: 'عادل رمزي', phone: '01012345620', camerasStatus: 'قيد التفكير', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'لم يدفع', electricityNotes: '' },
  { aptNumber: 21, name: 'باسم سمير', phone: '01012345621', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 22, name: 'رامي جلال', phone: '01012345622', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 23, name: 'وائل جمال', phone: '01012345623', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'تم الدفع', electricityNotes: '' },
  { aptNumber: 24, name: 'حازم شوقي', phone: '01012345624', camerasStatus: 'موافق', gasStatus: 'قدم', waterStatus: 'قدم', electricityStatus: 'لم يدفع', electricityNotes: 'سيحول فودافون كاش' },
];

export const STORAGE_KEY_APARTMENTS = 'building_apartments_data_v1';
export const STORAGE_KEY_CONFIG = 'building_config_data_v1';

export function loadSavedApartments(): ApartmentData[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_APARTMENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 24) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load apartments from localStorage', e);
  }
  return INITIAL_APARTMENTS;
}

export function saveApartments(data: ApartmentData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_APARTMENTS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save apartments to localStorage', e);
  }
}

export function loadSavedConfig(): BuildingConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load config from localStorage', e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: BuildingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config to localStorage', e);
  }
}
