export type CamerasStatus = 'موافق' | 'قيد التفكير' | 'لا يرغب';
export type ServiceStatus = 'قدم' | 'لم يقدم';
export type ElectricityPaymentStatus = 'تم الدفع' | 'لم يدفع';

export interface ApartmentData {
  aptNumber: number;
  name: string;
  phone: string;
  // Section 1: Cameras & Services
  camerasStatus: CamerasStatus;
  gasStatus: ServiceStatus;
  waterStatus: ServiceStatus;
  // Section 2: Electricity
  electricityStatus: ElectricityPaymentStatus;
  electricityNotes: string;
}

export interface BuildingConfig {
  buildingName: string;
  totalCamerasCost: number;
  requiredElectricityAmount: number;
  electricityPeriod: string;
}
