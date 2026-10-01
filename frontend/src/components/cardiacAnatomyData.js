/**
 * Cardiac Anatomy Reference Data
 * Clinically validated anatomical coordinates, blood supply territories, and diagnostic significance
 */

export const VESSEL_COLOR = { normal: '#10b981', moderate: '#f59e0b', critical: '#ef4444' };
export const VESSEL_LABEL = { normal: 'Clear', moderate: 'Moderate', critical: 'Severe' };

export const SURFACE_VESSELS = [
  {
    code: 'LAD',
    name: 'Left Anterior Descending',
    shortName: 'Anterior',
    coords: { x: 50, y: 58 },
    role: 'Courses down the anterior interventricular groove to the apex. Supplies ~50% of left ventricular myocardium and anterior 2/3 of the septum.',
    significance: 'Known as the "Widow Maker" — severe blockage causes anterior wall myocardial infarction and high risk of pump failure.',
    calloutSide: 'right',
  },
  {
    code: 'LCX',
    name: 'Left Circumflex Artery',
    shortName: 'Lateral',
    coords: { x: 67, y: 44 },
    role: 'Branches from Left Main trunk and wraps around coronary sulcus. Supplies lateral and posterolateral walls of the left ventricle.',
    significance: 'Occlusion causes lateral ischemia and can impair papillary muscles, leading to acute mitral valve regurgitation.',
    calloutSide: 'right',
  },
  {
    code: 'RCA',
    name: 'Right Coronary Artery',
    coords: { x: 33, y: 52 },
    shortName: 'Inferior',
    role: 'Runs in the right atrioventricular groove. Supplies right atrium, right ventricle, and gives rise to PDA for inferior wall.',
    significance: 'Supplies SA and AV conduction nodes — critical stenosis often causes severe bradycardia and conduction blocks.',
    calloutSide: 'left',
  },
];

export const DISSECTION_LANDMARKS = [
  {
    id: 'LV',
    name: 'Left Ventricle',
    tag: 'Primary Pump',
    coords: { x: 66, y: 64 },
    badgePos: 'right',
    role: 'Thick muscular chamber (3× thicker than right) responsible for pumping oxygenated blood at high pressure into systemic circulation via the aorta.',
    significance: 'Carries highest hemodynamic stress. Vulnerable to ischemic cardiomyopathy, hypertrophy, and systolic heart failure (HFrEF).',
  },
  {
    id: 'RV',
    name: 'Right Ventricle',
    tag: 'Pulmonary Flow',
    coords: { x: 30, y: 58 },
    badgePos: 'left',
    role: 'Crescent-shaped lower chamber that propels deoxygenated venous blood at lower pressure through the pulmonary trunk into the lungs.',
    significance: 'Thin-walled, volume-sensitive chamber. Vulnerable to pulmonary hypertension, tricuspid regurgitation, and RCA occlusion.',
  },
  {
    id: 'IVS',
    name: 'Interventricular Septum',
    tag: 'Conduction Hub',
    coords: { x: 50, y: 60 },
    badgePos: 'bottom',
    role: 'Muscular partition separating left and right ventricles. Carries the critical conduction system bundle branches (Bundle of His).',
    significance: 'Supplied predominantly by LAD septal perforators. Occlusion can cause ventricular septal rupture (VSR) or complete heart block.',
  },
  {
    id: 'VALVES',
    name: 'Atrioventricular Valves & Chordae',
    tag: 'Hemodynamic Seal',
    coords: { x: 52, y: 38 },
    badgePos: 'top',
    role: 'Fibrous leaflets anchored by tendon-like chordae tendineae and papillary muscles, preventing blood backflow during systolic contraction.',
    significance: 'Mitral & Tricuspid complexes. Rupture of chordae during acute ischemia causes acute valve flail, severe regurgitation, and cardiogenic edema.',
  },
];

export const POSTERIOR_VESSELS = [
  {
    code: 'CS',
    name: 'Coronary Sinus',
    shortName: 'Venous Hub',
    coords: { x: 48, y: 55 },
    role: 'Wide venous channel that collects ~85% of deoxygenated myocardial blood from coronary veins and returns it directly into the right atrium.',
    significance: 'Crucial clinical landmark for electrophysiology studies and biventricular pacemaker (CRT) left ventricular lead placement.',
    calloutSide: 'right',
  },
  {
    code: 'PDA',
    name: 'Posterior Descending Artery',
    shortName: 'Posterior',
    coords: { x: 52, y: 72 },
    role: 'Runs in posterior interventricular sulcus towards cardiac apex. Supplies the posterior 1/3 of the septum and inferior ventricular walls.',
    significance: 'Determines coronary dominance (right dominant in ~85% of population via RCA). Occlusion leads to inferior and posterior wall myocardial infarction.',
    calloutSide: 'right',
  },
  {
    code: 'PV',
    name: 'Pulmonary Veins',
    shortName: 'Oxygenated Return',
    coords: { x: 62, y: 38 },
    role: 'Four pulmonary veins that transport freshly oxygenated blood from the lungs into the left atrium.',
    significance: 'Site of ectopic electrical triggers for atrial fibrillation (AFib). Targeted during catheter pulmonary vein isolation (PVI) ablation.',
    calloutSide: 'left',
  },
];
