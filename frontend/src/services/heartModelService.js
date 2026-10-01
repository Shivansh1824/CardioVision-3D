/**
 * heartModelService.js
 * 
 * Manages Supabase Storage URLs, offline fallbacks,
 * background preloading, and anatomical landmark definitions for 3D cardiac viewing.
 */

// Supabase Storage Public URLs
const SUPABASE_STORAGE_URL = 'https://ykoewvodqxcccakaewya.supabase.co/storage/v1/object/public/models';

export const HEART_MODELS = {
  beating: {
    id: 'beating',
    name: 'Beating Heart',
    label: 'Beating Cycle',
    url: `${SUPABASE_STORAGE_URL}/beating_heart.glb`,
    fallbackUrl: '/models/beating_heart.glb',
    scale: 0.038,
    position: [0, -0.2, 0],
    rotation: [0, -0.3, 0],
    hasAnimation: true,
  },
  realistic: {
    id: 'realistic',
    name: 'Realistic Human Heart',
    label: 'Realistic Anatomy',
    url: `${SUPABASE_STORAGE_URL}/human_heart.glb`,
    fallbackUrl: '/models/human_heart.glb',
    scale: 1.15,
    position: [0, -0.35, 0],
    rotation: [0, 0.4, 0],
    hasAnimation: false,
  },
};

// Simplified, patient-friendly anatomical sections replacing generic numbers 1, 2, 3, 4
export const ANATOMICAL_PINS = [
  {
    id: 'lad',
    number: '1',
    code: 'LAD',
    name: 'Left Anterior Descending (LAD)',
    subtitle: 'Anterior Wall & Apex Perfusion',
    desc: 'Runs down the front groove of the heart. Supplies oxygen-rich blood to the entire front muscular wall and the apex (tip). Blockages here are the most critical.',
    position: [-0.3, 0.2, 1.2],
    color: '#f43f5e', // Rose
    accent: 'Coronary Artery',
  },
  {
    id: 'lcx',
    number: '2',
    code: 'LCX',
    name: 'Left Circumflex Artery (LCX)',
    subtitle: 'Lateral Left Ventricular Wall',
    desc: 'Branches off to encircle the left side of the heart muscle, supplying the lateral and posterior walls of the main pumping chamber.',
    position: [0.9, 0.35, 0.4],
    color: '#0284c7', // Sky Blue
    accent: 'Coronary Artery',
  },
  {
    id: 'rca',
    number: '3',
    code: 'RCA',
    name: 'Right Coronary Artery (RCA)',
    subtitle: 'Right Heart & Inferior Wall',
    desc: 'Travels down the right groove to nourish the right atrium, right ventricle, and electrical pacemaker nodes that regulate your rhythm.',
    position: [-0.95, 0.15, 0.3],
    color: '#10b981', // Emerald
    accent: 'Coronary Artery',
  },
  {
    id: 'lv',
    number: '4',
    code: 'LV',
    name: 'Left Ventricle (LV Chamber)',
    subtitle: 'Primary Systemic Muscular Pump',
    desc: 'The thickest and strongest chamber. Contracts with high pressure to drive oxygenated blood across the aorta and throughout the entire body.',
    position: [0.15, -0.55, 0.95],
    color: '#8b5cf6', // Violet
    accent: 'Cardiac Chamber',
  },
  {
    id: 'aorta',
    number: '5',
    code: 'AORTA',
    name: 'Ascending Aorta',
    subtitle: 'Main Systemic Arterial Trunk',
    desc: 'The largest blood vessel in the body. Directly receives high-velocity blood during ventricular contraction and distributes it systemically.',
    position: [-0.1, 0.9, 0.2],
    color: '#f59e0b', // Amber
    accent: 'Great Vessel',
  },
];

let preloaded = false;

/**
 * Background preloader: fetches models into browser cache immediately when site opens.
 * Prevents redundant fetches and ensures instant 3D rendering upon tab switch.
 */
export function preloadHeartModels() {
  if (preloaded || typeof window === 'undefined') return;
  preloaded = true;

  const urls = [
    HEART_MODELS.beating.url,
    HEART_MODELS.realistic.url,
  ];

  urls.forEach((url) => {
    fetch(url, { mode: 'cors', cache: 'force-cache' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.blob();
      })
      .then(() => {
        // Pre-cached in browser
      })
      .catch(() => {
        // Fetch failed, browser will use local fallback
      });
  });
}
