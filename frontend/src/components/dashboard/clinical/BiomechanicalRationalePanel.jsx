import { 
  Activity, 
  Droplet, 
  Flame, 
  Wind 
} from 'lucide-react';

/**
 * BiomechanicalRationalePanel — Clinical cause & effect mechanisms for What-If Simulator.
 * Explains active baseline values (High/Medium/Normal) as well as simulated changes in real time.
 */
export default function BiomechanicalRationalePanel({
  isSimulated,
  origBp,
  targetBp,
  origLdl,
  targetLdl,
  origFbs,
  targetFbs,
  isSmoker,
  stopSmoking,
  patientName,
}) {
  // ── BP Helper ──
  const bpIsChanged = isSimulated && targetBp !== origBp;
  const currentBp = bpIsChanged ? targetBp : origBp;

  const bpBadge = bpIsChanged
    ? (targetBp < origBp
        ? { text: `-${Math.round(((origBp - targetBp) / origBp) * 100)}% Wall Strain`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
        : { text: `+${Math.round(((targetBp - origBp) / origBp) * 100)}% Wall Strain`, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' })
    : (origBp >= 160
        ? { text: 'Severe High Pressure', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
        : origBp >= 140
        ? { text: 'Stage 1 Hypertension', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        : origBp >= 120
        ? { text: 'Elevated Pressure', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        : { text: 'Controlled Target', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' });

  const bpText = bpIsChanged
    ? (targetBp < origBp
        ? 'Lowering systolic pressure reduces cyclic endothelial stretch and stops vascular remodeling in the LAD and RCA.'
        : 'High pressure exerts destructive shear stresses on coronary bifurcations, prompting acute endothelial damage.')
    : (origBp >= 140
        ? `High pressure (${origBp} mmHg) exerts excessive shear stress against coronary walls, accelerating plaque build-up.`
        : origBp >= 120
        ? `Borderline pressure (${origBp} mmHg) increases myocardial resistance and coronary arterial workload.`
        : `Optimal pressure (${origBp} mmHg) minimizes endothelial wall stress and protects coronary microperfusion.`);

  // ── LDL Helper ──
  const ldlIsChanged = isSimulated && targetLdl !== origLdl;
  const currentLdl = ldlIsChanged ? targetLdl : origLdl;

  const ldlBadge = ldlIsChanged
    ? (targetLdl < origLdl
        ? { text: `-${Math.round(((origLdl - targetLdl) / origLdl) * 100)}% Plaque Lipids`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
        : { text: `+${Math.round(((targetLdl - origLdl) / origLdl) * 100)}% Plaque Lipids`, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' })
    : (origLdl >= 160
        ? { text: 'Severe High Lipids', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
        : origLdl >= 130
        ? { text: 'Borderline High LDL', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        : origLdl >= 100
        ? { text: 'Moderate Lipids', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        : { text: 'Optimal (<100 mg/dL)', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' });

  const ldlText = ldlIsChanged
    ? (targetLdl < origLdl
        ? 'Deprives atheromatous plaques of circulating lipids, stabilizing the fibrous cap against acute rupture.'
        : 'Excess apoB particles infiltrate the sub-endothelial space, fueling rapid macrophage foam-cell proliferation.')
    : (origLdl >= 130
        ? `Elevated LDL (${origLdl} mg/dL) rapidly infiltrates the sub-endothelial space to form narrowing atheroma plaques.`
        : origLdl >= 100
        ? `Moderate LDL (${origLdl} mg/dL) contributes to ongoing arterial plaque deposition over decades of life.`
        : `Optimal LDL (${origLdl} mg/dL) halts plaque expansion and keeps coronary artery lumens patent.`);

  // ── FBS Helper ──
  const fbsIsChanged = isSimulated && targetFbs !== origFbs;
  const currentFbs = fbsIsChanged ? targetFbs : origFbs;

  const fbsBadge = fbsIsChanged
    ? (targetFbs < origFbs
        ? { text: `-${Math.round(((origFbs - targetFbs) / origFbs) * 100)}% Glycation`, color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' }
        : { text: `+${Math.round(((targetFbs - origFbs) / origFbs) * 100)}% Glycation`, color: '#dc2626', bg: '#fef2f2', border: '#fecaca' })
    : (origFbs >= 126
        ? { text: 'Diabetic Range', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }
        : origFbs >= 100
        ? { text: 'Impaired Glucose', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        : { text: 'Healthy Normal', color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' });

  const fbsText = fbsIsChanged
    ? (targetFbs < origFbs
        ? 'Suppresses Advanced Glycation End-products (AGEs) and quenches reactive oxidative stress in microvascular endothelium.'
        : 'Hyperglycemia impairs endothelial nitric oxide synthase (eNOS), inducing microvascular stiffening.')
    : (origFbs >= 126
        ? `High fasting sugar (${origFbs} mg/dL) produces glycation end-products that stiffen coronary microvessels.`
        : origFbs >= 100
        ? `Elevated fasting glucose (${origFbs} mg/dL) increases systemic vascular inflammation and plaque vulnerability.`
        : `Normal blood sugar (${origFbs} mg/dL) preserves endothelial nitric oxide and prevents diabetic vessel injury.`);

  return (
    <div
      className="custom-scrollbar"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxHeight: 225,
        overflowY: 'auto',
        paddingRight: 2,
      }}
    >
      {/* 1. Blood Pressure Rationale Card */}
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          fontSize: '0.68rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#0f172a' }}>
            <Activity style={{ width: 12, height: 12, color: bpBadge.color }} />
            <span>
              {bpIsChanged ? `Blood Pressure (${origBp} ➔ ${targetBp} mmHg)` : `Blood Pressure (${origBp} mmHg)`}
            </span>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.62rem',
              color: bpBadge.color,
              background: bpBadge.bg,
              border: `1px solid ${bpBadge.border}`,
              padding: '1px 6px',
              borderRadius: 4,
            }}
          >
            {bpBadge.text}
          </span>
        </div>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.35 }}>
          {bpText}
        </p>
      </div>

      {/* 2. LDL Cholesterol Rationale Card */}
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          fontSize: '0.68rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#0f172a' }}>
            <Droplet style={{ width: 12, height: 12, color: ldlBadge.color }} />
            <span>
              {ldlIsChanged ? `LDL Cholesterol (${origLdl} ➔ ${targetLdl} mg/dL)` : `LDL Cholesterol (${origLdl} mg/dL)`}
            </span>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.62rem',
              color: ldlBadge.color,
              background: ldlBadge.bg,
              border: `1px solid ${ldlBadge.border}`,
              padding: '1px 6px',
              borderRadius: 4,
            }}
          >
            {ldlBadge.text}
          </span>
        </div>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.35 }}>
          {ldlText}
        </p>
      </div>

      {/* 3. Fasting Blood Sugar Rationale Card */}
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 8,
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          fontSize: '0.68rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#0f172a' }}>
            <Flame style={{ width: 12, height: 12, color: fbsBadge.color }} />
            <span>
              {fbsIsChanged ? `Fasting Glucose (${origFbs} ➔ ${targetFbs} mg/dL)` : `Fasting Blood Sugar (${origFbs} mg/dL)`}
            </span>
          </div>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.62rem',
              color: fbsBadge.color,
              background: fbsBadge.bg,
              border: `1px solid ${fbsBadge.border}`,
              padding: '1px 6px',
              borderRadius: 4,
            }}
          >
            {fbsBadge.text}
          </span>
        </div>
        <p style={{ margin: 0, color: '#64748b', lineHeight: 1.35 }}>
          {fbsText}
        </p>
      </div>

      {/* 4. Tobacco Smoking (Shown if patient is active smoker) */}
      {isSmoker && (
        <div
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            background: stopSmoking ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${stopSmoking ? '#bbf7d0' : '#fecaca'}`,
            fontSize: '0.68rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: stopSmoking ? '#166534' : '#991b1b' }}>
              <Wind style={{ width: 12, height: 12, color: stopSmoking ? '#16a34a' : '#ef4444' }} />
              <span>{stopSmoking ? 'Tobacco Cessation Achieved' : 'Active Tobacco Smoker'}</span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: '0.62rem',
                color: stopSmoking ? '#16a34a' : '#dc2626',
                background: stopSmoking ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${stopSmoking ? '#86efac' : '#fca5a5'}`,
                padding: '1px 6px',
                borderRadius: 4,
              }}
            >
              {stopSmoking ? '+100% Spasm Relief' : 'High Risk Factor'}
            </span>
          </div>
          <p style={{ margin: 0, color: stopSmoking ? '#14532d' : '#9f1239', lineHeight: 1.35 }}>
            {stopSmoking
              ? 'Halts nicotine-induced acute coronary vasospasm, instantly restoring myocardial oxygenation.'
              : 'Nicotine toxins injure vessel linings, trigger acute vasoconstriction, and accelerate plaque rupture.'}
          </p>
        </div>
      )}
    </div>
  );
}
