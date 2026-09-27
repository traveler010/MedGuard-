import { request } from './client';

export interface MedicineAnalyzePayload {
  medicine_1: string;
  medicine_2: string;
}

export interface MedicineAnalyzeResult {
  medicine_1: string;
  medicine_2: string;
  status: 'checked' | 'insufficient_data' | 'unknown';
  severity?: string | null;
  summary: string;
  details: string[];
  disclaimer: string;
}

export const medicineAnalyzerApi = {
  async analyze(medicine_1: string, medicine_2: string): Promise<MedicineAnalyzeResult> {
    return request<MedicineAnalyzeResult>('/medicine/analyze', {
      method: 'POST',
      body: JSON.stringify({ medicine_1, medicine_2 }),
    });
  },
};
