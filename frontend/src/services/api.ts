import { ApplicantInput, PredictionResult, BackendData } from '../types';
import { predictLocally } from './localModel';
import defaultBackendData from '../data/backendData.json';

const API_BASE_URL = 'http://localhost:8000';

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchProjectData(): Promise<BackendData> {
  try {
    const res = await fetch(`${API_BASE_URL}/data`);
    if (res.ok) {
      const data = await res.json();
      return data as BackendData;
    }
  } catch {
    // Graceful fallback to embedded authentic json
  }
  return defaultBackendData as unknown as BackendData;
}

export async function assessApplicant(applicant: ApplicantInput): Promise<PredictionResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicant),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        ...data,
        source: 'backend_live',
      };
    }
  } catch (err) {
    console.warn('Backend unavailable, using client-side calibrated ML engine:', err);
  }

  // Instant local prediction fallback
  return predictLocally(applicant);
}
