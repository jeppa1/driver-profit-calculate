export interface DriverInputs {
  earnings: number;
  kilometers: number;
  hours: number;
  gasPrice: number;
  efficiency: number; // km/L
}

export interface CalculationResult {
  fuelCost: number;
  maintenanceCost: number;
  totalExpenses: number;
  netProfit: number;
  hourlyWage: number;
}

export interface AIAnalysisResponse {
  advice: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}