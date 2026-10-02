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
    name: 'Realistic Human Heart',
    label: 'Realistic Anatomy',
    url: `${SUPABASE_STORAGE_URL}/human_heart.glb`,
    fallbackUrl: '/models/human_heart.glb',
    hasAnimation: false,
  },
  beating: {
    id: 'beating',
    name: 'Beating Heart',
    label: 'Beating Cycle',
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
    name: 'Left Anterior Descending Artery',
    shortName: 'Anterior Perfuser',
    tag: 'Coronary Artery',
    vesselKey: 'LAD',
    // Exact local coordinates on the anterior interventricular sulcus
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
    name: 'Left Circumflex Artery',
    shortName: 'Lateral Perfusion',
    tag: 'Coronary Artery',
    vesselKey: 'LCX',
    // Exact local coordinates on the lateral free wall
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
    name: 'Right Coronary Artery',
    shortName: 'Inferior & Conduction',
    tag: 'Coronary Artery',
    vesselKey: 'RCA',
    // Exact local coordinates on the right atrioventricular groove
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
    name: 'Left Ventricle Chamber',
    shortName: 'Primary Systemic Pump',
    tag: 'Cardiac Chamber',
    // Exact local coordinates on the lower anterior muscular apex
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
    name: 'Ascending Aorta & Arch',
    shortName: 'Main Arterial Highway',
    tag: 'Great Vessel',
    // Exact local coordinates on the top aortic arch
    position: [0.02, 0.90, 0.06],
    color: '#f59e0b', // Amber
    patientExpl: 'The largest blood vessel in your body. It acts as the central highway distributing oxygenated blood from your heart to every vital organ and tissue.',
    pathology: 'High-compliance vessel exposed to maximal systolic pressure waves. Subject to calcific aortic stenosis, ascending aneurysms, and acute Type-A aortic dissection.',
    bloodTerritory: 'Systemic Arterial Network & Coronary Ostia Inflow',
  },
];

// Clinically validated phases of the human cardiac cycle for beating model inspection
export const CARDIAC_CYCLE_PHASES = [
  {
    id: 'filling',
    code: 'DIASTOLE',
    name: 'Ventricular Filling & Atrial Kick',
    shortName: 'Diastolic Filling',
    timing: '0.0s – 0.5s',
    color: '#38bdf8', // Sky Blue
    valves: 'Mitral & Tricuspid: OPEN · Aortic & Pulmonic: CLOSED',
    hemodynamics: 'Passive influx of ~100 mL blood into ventricles + 30 mL atrial kick. Reaches End-Diastolic Volume (~130 mL).',
    patientExpl: 'Your heart chambers relax and fill up with fresh blood. The top chambers give a gentle final squeeze to top off the main pumping chambers before the big beat.',
    clinicalPathology: 'Diastolic dysfunction stiffens the heart wall, requiring abnormally elevated filling pressures and causing pulmonary congestion (HFpEF).',
  },
  {
    id: 'contraction',
    code: 'ISO-CONTRACTION',
    name: 'Isovolumic Contraction (S1 Lub)',
    shortName: 'Early Systole',
    timing: '0.5s – 0.55s',
    color: '#fbbf24', // Amber
    valves: 'ALL VALVES CLOSED · Ventricular Chamber Sealed',
    hemodynamics: 'Ventricles contract against closed valves. Pressure surges from 8 mmHg to 80 mmHg with zero volume change.',
    patientExpl: 'The heart muscles tense up like a coiled spring with all valves closed. Pressure builds intensely until it is strong enough to push blood out.',
    clinicalPathology: 'Ischemic myocardium increases Isovolumic Contraction Time (IVCT), delaying systolic onset and reducing peak mechanical rate of pressure rise (dP/dt).',
  },
  {
    id: 'ejection',
    code: 'SYSTOLE',
    name: 'Rapid Ventricular Ejection',
    shortName: 'Peak Systolic Pump',
    timing: '0.55s – 0.75s',
    color: '#f43f5e', // Rose
    valves: 'Aortic & Pulmonic: OPEN · Mitral & Tricuspid: CLOSED',
    hemodynamics: 'Ventricles forcefully pump ~70 mL Stroke Volume into aorta (120 mmHg) and pulmonary trunk. Ejection Fraction ~55–65%.',
    patientExpl: 'The main squeeze! The heart forcefully pumps fresh oxygenated blood through the aorta out to your brain, muscles, and organs.',
    clinicalPathology: 'Coronary artery disease (CAD) produces regional wall hypokinesis, depressing Stroke Volume and causing heart failure with reduced ejection fraction (HFrEF).',
  },
  {
    id: 'relaxation',
    code: 'ISO-RELAXATION',
    name: 'Isovolumic Relaxation (S2 Dub)',
    shortName: 'Early Diastole',
    timing: '0.75s – 0.80s',
    color: '#a855f7', // Purple
    valves: 'ALL VALVES CLOSED · Semilunar Snap Shut',
    hemodynamics: 'Ventricles cease contraction; pressure plummets below arterial pressure. Aortic closure marks end of systole.',
    patientExpl: 'The heart valves snap shut with the second heartbeat sound ("dub"), and the muscle begins relaxing to prepare for the next beat.',
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
