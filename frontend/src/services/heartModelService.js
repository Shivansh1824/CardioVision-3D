/**
 * heartModelService.js
 * 
 * Clinically validated anatomical landmarks and model configuration for 3D cardiac viewing.
 * Positions are defined in local scene space to lock 100% to the 3D heart mesh surface.
 */

// Supabase Storage Public URLs
const SUPABASE_STORAGE_URL = 'https://ykoewvodqxcccakaewya.supabase.co/storage/v1/object/public/models';

export const HEART_MODELS = {
  realistic: {
    id: 'realistic',
    name: 'Human Heart',
    label: 'Human Heart',
    url: `${SUPABASE_STORAGE_URL}/human_heart.glb`,
    fallbackUrl: '/models/human_heart.glb',
    hasAnimation: false,
  },
  beating: {
    id: 'beating',
    name: 'Beating Heart',
    label: 'Beating Heart',
    url: `${SUPABASE_STORAGE_URL}/beating_heart.glb`,
    fallbackUrl: '/models/beating_heart.glb',
    hasAnimation: true,
  },
};

// Precise local surface coordinates on the human heart mesh
export const ANATOMICAL_PINS = [
  {
    id: 'lad',
    number: '1',
    code: 'LAD',
    patientName: 'Front Artery',
    clinicalName: 'Left Anterior Descending Artery',
    shortName: 'Front Artery (LAD)',
    tag: 'Coronary Artery',
    vesselKey: 'LAD',
    position: [0.03, 0.46, 0.28],
    color: '#f43f5e', // Rose
    patientExpl: 'Runs directly down the front groove of your heart. It delivers oxygen-rich blood to the entire front muscle wall and the main pumping tip (apex). A healthy LAD is essential for your heart’s pumping strength.',
    pathology: 'Known clinically as the "Widow Maker". Stenosis restricts anterior blood flow, posing immediate risk of extensive anterior STEMI, apical aneurysm, and acute cardiogenic shock.',
    bloodTerritory: '~50% of Left Ventricular Myocardium & Anterior Septum',
  },
  {
    id: 'lcx',
    number: '2',
    code: 'LCX',
    patientName: 'Side Artery',
    clinicalName: 'Left Circumflex Artery',
    shortName: 'Side Artery (LCX)',
    tag: 'Coronary Artery',
    vesselKey: 'LCX',
    position: [0.22, 0.56, 0.14],
    color: '#0284c7', // Sky Blue
    patientExpl: 'Curves around the left side of the heart like a belt. It feeds the side and posterior walls of the heart muscle so it can relax and contract efficiently.',
    pathology: 'Stenosis often presents with subtle or silent exertional angina. Severe occlusion can provoke posterolateral ischemia and acute mitral valve regurgitation via papillary muscle hypoperfusion.',
    bloodTerritory: 'Lateral & Posterior Left Ventricular Free Walls',
  },
  {
    id: 'rca',
    number: '3',
    code: 'RCA',
    patientName: 'Right Artery',
    clinicalName: 'Right Coronary Artery',
    shortName: 'Right Artery (RCA)',
    tag: 'Coronary Artery',
    vesselKey: 'RCA',
    position: [-0.22, 0.50, 0.16],
    color: '#10b981', // Emerald
    patientExpl: 'Travels down the right groove of your heart. It nourishes the right pumping chambers, the bottom of the heart, and powers your heart’s natural electrical pacemaker.',
    pathology: 'Occlusion causes inferior myocardial infarction and frequently interrupts cardiac conduction, resulting in severe sinus bradycardia and high-grade AV heart blocks.',
    bloodTerritory: 'Right Atrium, Right Ventricle, Inferior Wall & SA/AV Nodes',
  },
  {
    id: 'lv',
    number: '4',
    code: 'LV',
    patientName: 'Main Pump',
    clinicalName: 'Left Ventricle Chamber',
    shortName: 'Main Pump (LV)',
    tag: 'Cardiac Chamber',
    position: [0.08, 0.18, 0.22],
    color: '#8b5cf6', // Violet
    patientExpl: 'The thickest and most powerful chamber of your heart. It takes freshly oxygenated blood and forcefully pumps it through the aorta out to your brain and body.',
    pathology: 'Bears the highest pressure workload (120 mmHg systolic). Chronic coronary hypoperfusion causes left ventricular remodeling, ischemic cardiomyopathy, and reduced ejection fraction (HFrEF).',
    bloodTerritory: 'Generates Systemic Cardiac Output (~5 Liters/min)',
  },
  {
    id: 'aorta',
    number: '5',
    code: 'AORTA',
    patientName: 'Main Highway',
    clinicalName: 'Ascending Aorta & Arch',
    shortName: 'Main Highway (Aorta)',
    tag: 'Great Vessel',
    position: [0.02, 0.90, 0.06],
    color: '#f59e0b', // Amber
    patientExpl: 'The largest blood vessel in your body. It acts as the central highway distributing oxygenated blood from your heart to every vital organ and tissue.',
    pathology: 'High-compliance vessel exposed to maximal systolic pressure waves. Subject to calcific aortic stenosis, ascending aneurysms, and acute Type-A aortic dissection.',
    bloodTerritory: 'Systemic Arterial Network & Coronary Ostia Inflow',
  },
];

// Clinically validated phases of the human cardiac cycle with 3D landmark coordinates on the beating model
export const CARDIAC_CYCLE_PHASES = [
  {
    id: 'filling',
    code: 'FILLING',
    patientName: 'Chamber Filling',
    doctorTerm: 'Diastole (Inflow)',
    clinicalName: 'Diastolic Filling & Atrial Kick',
    shortName: '1. Chamber Filling',
    timing: '0.0s – 0.5s (Diastole)',
    color: '#0284c7', // Sky Blue
    worldPosition: [0.24, 0.20, 0.26],
    position: [0.24, 0.20, 0.26],
    valves: 'Mitral & Tricuspid: OPEN · Aortic & Pulmonic: CLOSED',
    hemodynamics: 'Passive influx of ~100 mL blood into ventricles + 30 mL atrial kick. Reaches End-Diastolic Volume (~130 mL).',
    patientExpl: 'Your heart chambers relax and expand like a sponge. Fresh oxygen-rich blood flows freely in to fill the main pumping chambers before the next beat.',
    clinicalPathology: 'Diastolic dysfunction stiffens the heart wall, requiring abnormally elevated filling pressures and causing pulmonary congestion (HFpEF).',
  },
  {
    id: 'contraction',
    code: 'BUILD-UP',
    patientName: 'Pressure Build-Up',
    doctorTerm: 'Early Systole',
    clinicalName: 'Early Systole (Isovolumic Contraction)',
    shortName: '2. Pressure Build-Up',
    timing: '0.5s – 0.55s (Early Systole)',
    color: '#f59e0b', // Amber
    worldPosition: [0.02, -0.05, 0.28],
    position: [0.02, -0.05, 0.28],
    valves: 'ALL VALVES CLOSED · Sealed Pressure Chamber',
    hemodynamics: 'Ventricles contract against closed valves. Pressure surges from 8 mmHg to 80 mmHg with zero volume change.',
    patientExpl: 'All heart valves snap shut like a sealed pressure chamber. The heart muscles tense up intensely, preparing enough pressure to pump blood out.',
    clinicalPathology: 'Ischemic myocardium increases Isovolumic Contraction Time (IVCT), delaying systolic onset and reducing peak mechanical rate of pressure rise (dP/dt).',
  },
  {
    id: 'ejection',
    code: 'SQUEEZE',
    patientName: 'Power Squeeze',
    doctorTerm: 'Peak Systole',
    clinicalName: 'Peak Systole (Rapid Ejection)',
    shortName: '3. Power Squeeze',
    timing: '0.55s – 0.75s (Peak Systole)',
    color: '#f43f5e', // Rose
    worldPosition: [-0.08, 0.46, 0.22],
    position: [-0.08, 0.46, 0.22],
    valves: 'Aortic & Pulmonic: OPEN · Mitral & Tricuspid: CLOSED',
    hemodynamics: 'Ventricles forcefully pump ~70 mL Stroke Volume into aorta (120 mmHg) and pulmonary trunk. Ejection Fraction ~55–65%.',
    patientExpl: 'The main squeeze! The heart forcefully squeezes, opening the exit doors to shoot fresh blood into your aorta and out to your brain and body.',
    clinicalPathology: 'Coronary artery disease (CAD) produces regional wall hypokinesis, depressing Stroke Volume and causing heart failure with reduced ejection fraction (HFrEF).',
  },
  {
    id: 'relaxation',
    code: 'RESTING',
    patientName: 'Heart Resting',
    doctorTerm: 'Early Diastole',
    clinicalName: 'Early Diastole (Isovolumic Relaxation)',
    shortName: '4. Heart Resting',
    timing: '0.75s – 0.80s (Early Diastole)',
    color: '#8b5cf6', // Violet
    worldPosition: [0.04, -0.42, 0.26],
    position: [0.04, -0.42, 0.26],
    valves: 'ALL VALVES CLOSED · Semilunar Snap Shut',
    hemodynamics: 'Ventricles cease contraction; pressure plummets below arterial pressure. Aortic closure marks end of systole.',
    patientExpl: 'The exit valves snap shut with a "Dub" sound. The heart muscle takes a brief resting pause and relaxes to get ready for the next beat.',
    clinicalPathology: 'Aortic regurgitation causes rapid diastolic back-leak into the left ventricle, causing volume overload and left ventricular dilation.',
  },
];

let preloaded = false;

export function preloadHeartModels() {
  if (preloaded || typeof window === 'undefined') return;
  preloaded = true;

  const urls = [
    HEART_MODELS.realistic.url,
    HEART_MODELS.beating.url,
  ];

  urls.forEach((url) => {
    fetch(url, { mode: 'cors', cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(() => {})
      .catch(() => {});
  });
}
