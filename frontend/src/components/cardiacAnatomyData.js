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
    flow: 'Originates from the Left Main trunk and courses along anterior interventricular sulcus to the cardiac apex. Perfuses ~50% of the left ventricular mass and anterior two-thirds of the interventricular septum.',
    pathology: 'Known clinically as the "Widow Maker". Critical stenosis triggers massive anterior STEMI, pump failure, apical aneurysm, and cardiogenic shock.',
    calloutSide: 'right',
  },
  {
    code: 'LCX',
    name: 'Left Circumflex Artery',
    shortName: 'Lateral',
    coords: { x: 67, y: 44 },
    flow: 'Curves leftward within coronary sulcus around the base of the heart. Perfuses the lateral and posterior free walls of the left ventricle and anterolateral papillary muscle.',
    pathology: 'Stenosis often presents silently or as lateral ischemia. Can induce acute ischemic mitral regurgitation due to papillary muscle hypoperfusion.',
    calloutSide: 'right',
  },
  {
    code: 'RCA',
    name: 'Right Coronary Artery',
    shortName: 'Inferior',
    coords: { x: 33, y: 52 },
    flow: 'Passes downward in the right atrioventricular groove. Perfuses the right atrium, right ventricle, and gives off nodal branches to SA (60%) and AV (90%) nodes.',
    pathology: 'Acute occlusion triggers inferior wall infarction, severe sinus bradycardia, high-grade AV block, and right ventricular pump failure.',
    calloutSide: 'left',
  },
];

export const DISSECTION_LANDMARKS = [
  {
    id: 'LV',
    name: 'Left Ventricle',
    tag: 'Systemic Pump',
    coords: { x: 66, y: 64 },
    badgePos: 'right',
    flow: 'Thick-walled high-pressure muscular chamber. Generates systolic pressures (120 mmHg) to pump oxygen-saturated blood through the aortic valve into systemic circulation.',
    pathology: 'Bears highest hemodynamic workload. Highly susceptible to myocardial infarction, ischemic cardiomyopathy, hypertrophy, and systolic heart failure (HFrEF).',
    calloutSide: 'right',
  },
  {
    id: 'RV',
    name: 'Right Ventricle',
    tag: 'Pulmonary Circuit',
    coords: { x: 30, y: 58 },
    badgePos: 'left',
    flow: 'Crescent-shaped thin chamber that receives deoxygenated blood from the right atrium and propels it into pulmonary circulation at low resistance (25 mmHg).',
    pathology: 'Sensitive to volume and pressure overload. Vulnerable to acute pulmonary embolism, RV infarction (from proximal RCA lesion), and tricuspid regurgitation.',
    calloutSide: 'left',
  },
  {
    id: 'IVS',
    name: 'Interventricular Septum',
    tag: 'Conduction Hub',
    coords: { x: 50, y: 60 },
    badgePos: 'bottom',
    flow: 'Muscular divider between left and right ventricles. Carries the critical conduction system bundle branches (Bundle of His and Purkinje fibers).',
    pathology: 'Supplied predominantly by LAD septal perforator branches. Occlusion can provoke lethal ventricular septal rupture (VSR) or complete heart block.',
    calloutSide: 'right',
  },
  {
    id: 'VALVES',
    name: 'AV Valves & Chordae Tendineae',
    tag: 'Hemodynamic Seal',
    coords: { x: 52, y: 38 },
    badgePos: 'top',
    flow: 'Fibrous leaflets (Mitral & Tricuspid) anchored by fibrous chordae tendineae to muscular papillary pillars, preventing systolic backflow into atria.',
    pathology: 'Ischemic papillary muscle dysfunction or ruptured chordae causes acute, catastrophic mitral regurgitation and sudden pulmonary edema.',
    calloutSide: 'right',
  },
  {
    id: 'RA',
    name: 'Right Atrium & Caval Inlets',
    tag: 'Venous Reservoir',
    coords: { x: 26, y: 36 },
    badgePos: 'left',
    flow: 'Receives systemic deoxygenated venous return from Superior Vena Cava (SVC) and Inferior Vena Cava (IVC); houses the primary Sinoatrial (SA) node pacemaker.',
    pathology: 'Subject to atrial enlargement in tricuspid stenosis or pulmonary hypertension; origin zone for atrial flutter and nodal reentrant tachycardias.',
    calloutSide: 'left',
  },
  {
    id: 'AORTA',
    name: 'Ascending Aorta & Root',
    tag: 'Outflow Conduit',
    coords: { x: 54, y: 18 },
    badgePos: 'top',
    flow: 'High-compliance systemic elastic conduit. Distributes pulsatile ventricular stroke volume, housing the sinuses of Valsalva where coronary ostia emerge.',
    pathology: 'High-shear stress vessel; site of type-A aortic dissection, aortic root aneurysm, and calcific aortic stenosis.',
    calloutSide: 'right',
  },
];

export const POSTERIOR_VESSELS = [
  {
    code: 'CS',
    name: 'Coronary Sinus',
    shortName: 'Venous Hub',
    coords: { x: 48, y: 55 },
    flow: 'Wide venous channel in the posterior coronary sulcus. Gathers ~85% of deoxygenated myocardial blood and empties directly into the right atrium.',
    pathology: 'Key anatomical landmark for electrophysiologic mapping and delivery of left ventricular pacing leads in cardiac resynchronization therapy (CRT).',
    calloutSide: 'right',
  },
  {
    code: 'PDA',
    name: 'Posterior Descending Artery',
    shortName: 'Posterior',
    coords: { x: 52, y: 72 },
    flow: 'Travels down posterior interventricular sulcus towards the cardiac apex. Perfuses the posterior third of the septum and inferior left/right ventricular walls.',
    pathology: 'Determines coronary dominance (right dominant in ~85% of patients). Occlusion causes inferior/posterior STEMI and bradyarrhythmias.',
    calloutSide: 'right',
  },
  {
    code: 'PV',
    name: 'Pulmonary Veins',
    shortName: 'Oxygen Return',
    coords: { x: 62, y: 38 },
    flow: 'Four veins (two left, two right) conveying freshly oxygenated blood from the pulmonary capillary bed into the left atrium.',
    pathology: 'Myocardial sleeves extending into pulmonary vein orifices are the primary anatomical triggers for Paroxysmal Atrial Fibrillation (AFib).',
    calloutSide: 'right',
  },
];
