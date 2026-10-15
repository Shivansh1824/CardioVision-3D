/**
 * simulationCalculationService.js
 * 
 * High-precision local calibrated simulator for systolic BP, LDL cholesterol,
 * and blood sugar (fasting glucose / FBS) with live 3D vascular cooling.
 */
export function calculateLocalSimulation(patient, targetBp, targetLdl, targetFbs, stopSmoking) {
  const origBp = Number(patient?.bp) || 120;
  const origLdl = Number(patient?.ldl) || 100;
  const origFbs = Number(patient?.fbs) || 110;
  const isSmoker = Number(patient?.current_smoker) > 0;

  // Real calibrated model baseline anchors
  const baseCad = (Number(patient?.cad_risk_pct) || 80) / 100;
  const baseLad = (Number(patient?.lad_risk_pct) || 49) / 100;
  const baseLcx = (Number(patient?.lcx_risk_pct) || 21) / 100;
  const baseRca = (Number(patient?.rca_risk_pct) || 46) / 100;

  // Compute bidirectional changes (positive delta = lower risk, negative delta = higher risk)
  const bpDeltaRatio = origBp > 0 ? (origBp - targetBp) / origBp : 0;
  const ldlDeltaRatio = origLdl > 0 ? (origLdl - targetLdl) / origLdl : 0;
  const fbsDeltaRatio = origFbs > 0 ? (origFbs - targetFbs) / origFbs : 0;
  const smokeFactor = (isSmoker && stopSmoking) ? 0.22 : 0;

  // Individual lever percentage contributions for rationale
  const bpImpactPct = Math.round(bpDeltaRatio * 35);
  const ldlImpactPct = Math.round(ldlDeltaRatio * 42);
  const fbsImpactPct = Math.round(fbsDeltaRatio * 22);
  const smokeImpactPct = stopSmoking ? 14 : 0;

  // Composite net clinical change score (-1.0 to +1.0)
  const netScore = (bpDeltaRatio * 0.38) + (ldlDeltaRatio * 0.44) + (fbsDeltaRatio * 0.20) + (smokeFactor * 0.28);

  let simCad, simLad, simLcx, simRca;
  let isEscalation = false;
  let escalationPct = 0;
  let relativeRiskReduction = 0;

  if (Math.abs(netScore) < 0.001) {
    // Exact baseline
    simCad = baseCad;
    simLad = baseLad;
    simLcx = baseLcx;
    simRca = baseRca;
  } else if (netScore > 0) {
    // Therapeutic cooling
    const reductionRatio = Math.min(0.72, netScore);
    simCad = Math.max(0.08, baseCad * (1 - reductionRatio * 0.95));
    simLad = Math.max(0.05, baseLad * (1 - reductionRatio * 1.05));
    simLcx = Math.max(0.05, baseLcx * (1 - reductionRatio * 0.95));
    simRca = Math.max(0.04, baseRca * (1 - reductionRatio * 0.90));
    relativeRiskReduction = Math.round(((baseCad - simCad) / baseCad) * 100);
  } else {
    // Risk Escalation
    isEscalation = true;
    const escalationRatio = Math.min(1.25, Math.abs(netScore) * 1.35);
    simCad = Math.min(0.98, baseCad + (1 - baseCad) * escalationRatio * 0.75);
    simLad = Math.min(0.98, baseLad + (1 - baseLad) * escalationRatio * 0.85);
    simLcx = Math.min(0.96, baseLcx + (1 - baseLcx) * escalationRatio * 0.90);
    simRca = Math.min(0.92, baseRca + (1 - baseRca) * escalationRatio * 1.30);
    escalationPct = Math.round(((simCad - baseCad) / baseCad) * 100);
  }

  return {
    baseCad: Math.round(baseCad * 100),
    simCad: Math.round(simCad * 100),
    isEscalation,
    escalationPct,
    relativeRiskReduction,
    bpImpactPct,
    ldlImpactPct,
    fbsImpactPct,
    smokeImpactPct,
    vessels: {
      lad: { probability: simLad, is_blocked: simLad >= 0.5955, status: simLad >= 0.5955 ? 'Stenotic (>= 50%)' : (simLad >= 0.40 ? 'Moderate Plaque' : 'Patent / Controlled') },
      lcx: { probability: simLcx, is_blocked: simLcx >= 0.4322, status: simLcx >= 0.4322 ? 'Stenotic (>= 50%)' : (simLcx >= 0.35 ? 'Moderate Plaque' : 'Patent') },
      rca: { probability: simRca, is_blocked: simRca >= 0.3759, status: simRca >= 0.3759 ? 'Stenotic (>= 50%)' : (simRca >= 0.28 ? 'Moderate Plaque' : 'Patent') },
    },
  };
}
