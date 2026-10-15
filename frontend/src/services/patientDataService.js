import authoritativePatients from '../data/authoritativePatients.json';
import { supabase } from './supabaseClient';
import { getLocalRecords } from './ehrStorageService';

const CACHE_KEY = 'cv_authoritative_patients_v1';

/**
 * Get committed EHR care plans mapped by patient ID
 */
function getCommittedPlansMap() {
  const map = {};
  try {
    const local = getLocalRecords();
    if (Array.isArray(local)) {
      local.forEach((r) => {
        const pid = Number(r.patient_id);
        if (pid && !map[pid]) {
          map[pid] = {
            hasPlan: true,
            baselineCadRisk: Number(r.baseline_cad_risk),
            projectedCadRisk: Number(r.simulated_cad_risk),
            riskReductionPct: Number(r.risk_reduction_pct),
            planTitle: r.plan_title,
            createdAt: r.created_at,
          };
        }
      });
    }
  } catch (_) {}
  return map;
}

/**
 * Enriches patient object with committed treatment plan info if exists
 */
export function enrichPatientWithCarePlan(patient) {
  if (!patient) return patient;
  const plansMap = getCommittedPlansMap();
  const plan = plansMap[Number(patient.id)];

  if (plan) {
    return {
      ...patient,
      has_committed_plan: true,
      committed_plan: plan,
      projected_cad_risk: plan.projectedCadRisk,
      risk_reduction_pct: plan.riskReductionPct,
    };
  }

  return {
    ...patient,
    has_committed_plan: false,
    committed_plan: null,
  };
}

/**
 * Returns all 303 patients with genuine ML-computed CAD risks,
 * strictly ordered by clinical risk tier: Critical -> Moderate -> Stable,
 * and within each tier sorted by CAD Risk % descending.
 */
export function getAllPatients({ filterTier = 'all', searchQuery = '' } = {}) {
  const plansMap = getCommittedPlansMap();

  let list = authoritativePatients.map((p) => {
    const plan = plansMap[Number(p.id)];
    return {
      ...p,
      has_committed_plan: Boolean(plan),
      committed_plan: plan || null,
      projected_cad_risk: plan ? plan.projectedCadRisk : p.cad_risk_pct,
      risk_reduction_pct: plan ? plan.riskReductionPct : 0,
    };
  });

  // Filter by tier
  if (filterTier !== 'all') {
    list = list.filter((p) => p._triage === filterTier);
  }

  // Search filter
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter((p) => {
      return (
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.patient_code && p.patient_code.toLowerCase().includes(q)) ||
        String(p.id).includes(q) ||
        (p.vessel && p.vessel.toLowerCase().includes(q)) ||
        String(p.age).includes(q)
      );
    });
  }

  // Strict Risk Ordering:
  // 1. Critical first (CAD risk desc)
  // 2. Moderate second (CAD risk desc)
  // 3. Stable third (CAD risk desc)
  const tierWeight = { critical: 3, moderate: 2, stable: 1 };

  list.sort((a, b) => {
    const weightDiff = (tierWeight[b._triage] || 0) - (tierWeight[a._triage] || 0);
    if (weightDiff !== 0) return weightDiff;
    return (b.cad_risk_pct || 0) - (a.cad_risk_pct || 0);
  });

  return list;
}

/**
 * Returns single patient by ID or patient_code with full ML metrics and care plan
 */
export function getPatientById(idOrCode) {
  if (!idOrCode) return enrichPatientWithCarePlan(authoritativePatients[0]);

  const p = authoritativePatients.find(
    (item) => String(item.id) === String(idOrCode) || item.patient_code === String(idOrCode)
  );

  return enrichPatientWithCarePlan(p || authoritativePatients[0]);
}

/**
 * Returns triage cohort breakdown counts directly from authoritative data
 */
export function getTriageCounts() {
  let critical = 0;
  let moderate = 0;
  let stable = 0;

  authoritativePatients.forEach((p) => {
    if (p._triage === 'critical') critical++;
    else if (p._triage === 'moderate') moderate++;
    else stable++;
  });

  return {
    all: authoritativePatients.length,
    critical,
    moderate,
    stable,
  };
}
