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
    coords: { x: 66, y: 64 },
    role: 'Thick muscular chamber (3× thicker than right) responsible for pumping oxygenated blood at high pressure into systemic circulation via the aorta.',
  },
  {
    id: 'RV',
    name: 'Right Ventricle',
    coords: { x: 30, y: 58 },
    role: 'Crescent-shaped lower chamber that propels deoxygenated venous blood at lower pressure through the pulmonary trunk into the lungs.',
  },
  {
    id: 'IVS',
    name: 'Interventricular Septum',
    coords: { x: 50, y: 60 },
    role: 'Muscular partition separating left and right ventricles. Carries the critical conduction system bundle branches (Bundle of His).',
  },
  {
    id: 'VALVES',
    name: 'Atrioventricular Valves & Chordae',
    coords: { x: 52, y: 38 },
    role: 'Fibrous leaflets anchored by tendon-like chordae tendineae and papillary muscles, preventing blood backflow during systolic contraction.',
  },
];
