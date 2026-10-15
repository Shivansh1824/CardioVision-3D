/**
 * Vercel Serverless Function / API Route: /api/analyze-document
 * Multimodal Cardiovascular Document OCR & Classification using Gemini 3.8 Flash.
 */

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const PROMPT_SPEC = `
<context>
You are an expert clinical multimodal document classifier and data extraction engine for CardioVision 3D.
Analyze the uploaded document. Read ONLY what is visible in the document. Do NOT infer, correct, or hallucinate values.
</context>

<modalities>
CardioVision 3D supports three cardiovascular diagnostic modalities:
1. Blood Biochemistry / Serum Lipid Profile (LDL, HDL, Triglycerides, Fasting Blood Sugar, Creatinine, BUN, CBC)
2. 12-Lead Electrocardiogram (ECG) Report (ST-segment elevation/depression, T-wave inversion, Q-wave, LVH, BBB)
3. 2D Transthoracic Echocardiogram (TTE) Report (LVEF %, Regional Wall Motion Abnormalities, Valvular Heart Disease)

Unrelated documents include: dental invoices, retail receipts, ophthalmic prescriptions, discharge summaries without cardiac telemetry, or commercial bills.
</modalities>

<task>
1. Determine if the document is a supported cardiovascular diagnostic report.
2. If unrelated:
   - Set is_cardiac: false
   - Set document_type (e.g. "Dental Invoice", "Retail Receipt", "Unrelated Commercial Document")
   - Provide a concise clinical rejection_reason explaining what the document is and why it cannot be accepted.
   - Set extracted_data: null
3. If valid:
   - Set is_cardiac: true
   - Extract patient info, vitals, biochemistry, ECG, and echocardiogram parameters.
   - For missing or unreadable fields, emit null. Never guess.
   - Provide a clinical_summary synthesis.
</task>

<output_format>
Return ONLY a valid JSON object matching:
{
  "is_cardiac": boolean,
  "document_type": string,
  "rejection_reason": string | null,
  "overall_confidence": number,
  "modalities_detected": string[],
  "extracted_data": {
    "patient": {
      "name": string | null,
      "age": number | null,
      "sex": string | null,
      "patient_id": string | null
    },
    "vitals": {
      "bp_systolic": number | null,
      "bp_diastolic": number | null,
      "pulse_rate": number | null,
      "bmi": number | null
    },
    "biochemistry": {
      "total_cholesterol": number | null,
      "ldl": number | null,
      "hdl": number | null,
      "triglycerides": number | null,
      "fasting_blood_sugar": number | null,
      "creatinine": number | null,
      "bun": number | null,
      "hemoglobin": number | null
    },
    "ecg_findings": {
      "st_depression": boolean | null,
      "tinversion": boolean | null,
      "q_wave": boolean | null,
      "lvh": boolean | null,
      "bbb": boolean | null,
      "summary": string | null
    },
    "echo_findings": {
      "ef_tte": number | null,
      "region_rwma": number | null,
      "rwma": string | null,
      "vhd": string | null
    },
    "clinical_summary": string
  } | null
}
</output_format>

<verification>
- Grounding: Extract ONLY what is visible. Mark any absent field as null.
- Do NOT output markdown code fences, prose, or extra text; return raw JSON only.
</verification>
`;

async function callGeminiWithRetry(apiKey, base64Data, mimeType, maxRetries = 3) {
  const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: PROMPT_SPEC },
          {
            inlineData: {
              mimeType: mimeType || 'application/pdf',
              data: base64Data,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: 'application/json',
    },
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const json = await response.json();
        const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) {
          throw new Error('Empty response parts from Gemini');
        }
        return JSON.parse(candidateText);
      }

      const errorBody = await response.text();
      console.warn(`[Gemini API] Attempt ${attempt} failed (status ${response.status}):`, errorBody);

      if ((response.status === 503 || response.status === 429) && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, attempt * 1500));
        continue;
      }

      throw new Error(`Gemini API HTTP ${response.status}: ${errorBody}`);
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server environment.',
      });
    }

    const { fileBase64, mimeType, fileUrl, fileName } = req.body || {};

    let resolvedBase64 = fileBase64;
    let resolvedMimeType = mimeType || 'application/pdf';

    // If a remote fileUrl is passed (e.g. Supabase Storage), fetch it into buffer
    if (!resolvedBase64 && fileUrl) {
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        throw new Error(`Failed to fetch file from remote URL: ${fileRes.statusText}`);
      }
      const arrayBuffer = await fileRes.arrayBuffer();
      resolvedBase64 = Buffer.from(arrayBuffer).toString('base64');
      resolvedMimeType = fileRes.headers.get('content-type') || resolvedMimeType;
    }

    if (!resolvedBase64) {
      return res.status(400).json({ error: 'Missing fileBase64 or fileUrl in request body.' });
    }

    const analysis = await callGeminiWithRetry(apiKey, resolvedBase64, resolvedMimeType);

    return res.status(200).json({
      success: true,
      analysis,
      meta: {
        fileName: fileName || 'uploaded_document',
        model: GEMINI_MODEL,
        processedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[Document Analysis Error]:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal processing error',
    });
  }
}
