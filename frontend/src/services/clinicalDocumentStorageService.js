import { supabase } from './supabaseClient';

const BUCKET_NAME = 'clinical-documents';
const SUPABASE_STORAGE_BASE = 'https://ykoewvodqxcccakaewya.supabase.co/storage/v1/object/public/clinical-documents';

/**
 * Authoritative Supabase Storage URLs for Judge Demo Sample PDFs
 */
export const SAMPLE_DOC_STORAGE_URLS = {
  valid: `${SUPABASE_STORAGE_BASE}/samples/sample_cardiac_diagnostic_report.pdf`,
  invalid: `${SUPABASE_STORAGE_BASE}/samples/sample_unrelated_document.pdf`,
  // Local fallback paths in case of network disconnect
  localValid: '/samples/sample_cardiac_diagnostic_report.pdf',
  localInvalid: '/samples/sample_unrelated_document.pdf',
};

/**
 * Uploads a clinical report (PDF/JPG/PNG) directly to Supabase Storage bucket 'clinical-documents'
 * @param {File|Blob} file 
 * @param {string} [patientCode='PT-INTAKE']
 * @returns {Promise<{ success: boolean, publicUrl: string, path: string, error?: string }>}
 */
export async function uploadClinicalDocumentToSupabase(file, patientCode = 'PT-INTAKE') {
  if (!supabase) {
    console.warn('[Storage] Supabase client not initialized, using local fallback URL.');
    return {
      success: true,
      publicUrl: URL.createObjectURL(file),
      path: `local/${file.name}`,
    };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `intake/${patientCode}_${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/pdf',
      });

    if (error) {
      console.warn('[Storage] Supabase upload failed, falling back:', error.message);
      return {
        success: false,
        publicUrl: URL.createObjectURL(file),
        path: storagePath,
        error: error.message,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      publicUrl: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error('[Storage] Unexpected error uploading to Supabase:', err);
    return {
      success: false,
      publicUrl: URL.createObjectURL(file),
      path: `local/${file.name}`,
      error: err.message,
    };
  }
}
