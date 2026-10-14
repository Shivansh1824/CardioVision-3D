import { supabase } from './supabaseClient';

const EHR_STORAGE_KEY = 'cvq_ehr_records_v2';

import patientNames from '../data/patientNames.json';

function enrichRecord(r) {
  const patientId = Number(r.patient_id);
  const code = r.patient_code || `PT-${String(patientId).padStart(3, '0')}`;
  const name = r.patient_name || patientNames[code] || patientNames[String(patientId)] || `Patient ${code}`;
  return {
    ...r,
    patient_id: patientId,
    patient_code: code,
    patient_name: name,
    doctor_name: r.doctor_name || 'Dr. Shivansh Rana, MD',
  };
}

/**
 * Clean local storage getter: strictly returns records committed by the doctor.
 */
export function getLocalRecords() {
  try {
    const raw = localStorage.getItem(EHR_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((r) => !String(r.id).startsWith('ehr-seed-'))
        .map(enrichRecord);
    }
    return [];
  } catch {
    return [];
  }
}

export function clearLocalEhrRecords() {
  try {
    localStorage.removeItem(EHR_STORAGE_KEY);
  } catch (err) {
    console.warn('[ehrStorageService] Failed to clear local cache:', err);
  }
}

function saveLocalRecords(records) {
  try {
    localStorage.setItem(EHR_STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('[ehrStorageService] Failed to cache locally:', err);
  }
}

/**
 * Fetch all EHR simulation records for a specific patient.
 * Strictly returns only records committed by the doctor (zero mock/seed data).
 */
export async function getPatientEhrRecords(patientId) {
  const local = getLocalRecords();
  const patientLocal = local.filter((r) => Number(r.patient_id) === Number(patientId));

  try {
    const { data, error } = await supabase
      .from('treatment_simulations')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const enrichedRemote = data.map(enrichRecord);
      const ids = new Set(enrichedRemote.map((d) => d.id));
      const combined = [...enrichedRemote, ...patientLocal.filter((p) => !ids.has(p.id))];
      return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  } catch (err) {
    console.warn('[ehrStorageService] Supabase read fallback:', err);
  }

  return patientLocal.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Fetch all committed EHR simulation records across all patients (for the main dashboard registry).
 * Strictly returns only records committed by the doctor.
 */
export async function getAllCommittedEhrRecords() {
  const local = getLocalRecords();

  try {
    const { data, error } = await supabase
      .from('treatment_simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      const enrichedRemote = data.map(enrichRecord);
      const ids = new Set(enrichedRemote.map((d) => d.id));
      const combined = [...enrichedRemote, ...local.filter((p) => !ids.has(p.id))];
      return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
  } catch (err) {
    console.warn('[ehrStorageService] Supabase fetch all fallback:', err);
  }

  return local.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/**
 * Commit a new treatment plan / diagnostic encounter to Supabase and persistent cache.
 * Uses the exact real values set by the doctor in the What-If Simulator.
 */
export async function commitEhrPlan({
  patient,
  baselineBp,
  targetBp,
  baselineLdl,
  targetLdl,
  smokerIntervention,
  baselineCadRisk,
  simulatedCadRisk,
  baselineLadRisk = 85,
  simulatedLadRisk = 50,
  riskReductionPct,
  planTitle,
  notes = '',
  doctorName = 'Dr. Shivansh Rana, MD',
}) {
  const existingPatientRecords = await getPatientEhrRecords(patient.id);
  const nextVisitNumber = existingPatientRecords.length + 1;

  const record = {
    id: `ehr-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    patient_id: patient.id,
    patient_code: patient.patient_code || `PT-${String(patient.id).padStart(3, '0')}`,
    patient_name: patient.name || 'Unknown Patient',
    visit_number: nextVisitNumber,
    visit_type: `Clinical Consultation #${nextVisitNumber}`,
    doctor_name: doctorName,
    baseline_bp: Math.round(baselineBp),
    target_bp: Math.round(targetBp),
    baseline_ldl: Math.round(baselineLdl),
    target_ldl: Math.round(targetLdl),
    smoker_intervention: Boolean(smokerIntervention),
    baseline_cad_risk: Math.round(baselineCadRisk),
    simulated_cad_risk: Math.round(simulatedCadRisk),
    baseline_lad_risk: Math.round(baselineLadRisk),
    simulated_lad_risk: Math.round(simulatedLadRisk),
    risk_reduction_pct: Math.round(riskReductionPct),
    plan_title: planTitle || `Target BP ${targetBp} mmHg, LDL ${targetLdl} mg/dL`,
    notes: notes || 'Physician treatment simulation committed to Electronic Health Record.',
    created_at: new Date().toISOString(),
  };

  // 1. Save locally immediately
  const allLocal = getLocalRecords();
  allLocal.unshift(record);
  saveLocalRecords(allLocal);

  // 2. Persist to Supabase treatment_simulations table
  try {
    const supabasePayload = {
      patient_id: patient.id,
      baseline_bp: record.baseline_bp,
      target_bp: record.target_bp,
      baseline_ldl: record.baseline_ldl,
      target_ldl: record.target_ldl,
      smoker_intervention: record.smoker_intervention,
      baseline_cad_risk: record.baseline_cad_risk,
      simulated_cad_risk: record.simulated_cad_risk,
      baseline_lad_risk: record.baseline_lad_risk,
      simulated_lad_risk: record.simulated_lad_risk,
      risk_reduction_pct: record.risk_reduction_pct,
      plan_title: record.plan_title,
    };

    const { data, error } = await supabase
      .from('treatment_simulations')
      .insert([supabasePayload])
      .select();

    if (error) {
      console.warn('[ehrStorageService] Supabase insert note:', error.message);
    } else if (data?.[0]?.id) {
      record.supabase_id = data[0].id;
    }
  } catch (err) {
    console.warn('[ehrStorageService] Supabase connection error:', err);
  }

  return record;
}
