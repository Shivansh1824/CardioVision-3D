import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_MODEL = "gemini-3.8-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY secret is not configured in Supabase Edge Function." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { fileBase64, mimeType, fileUrl, fileName } = await req.json();

    let resolvedBase64 = fileBase64;
    let resolvedMimeType = mimeType || "application/pdf";

    if (!resolvedBase64 && fileUrl) {
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        throw new Error(`Failed to fetch file from remote URL: ${fileRes.statusText}`);
      }
      const arrayBuffer = await fileRes.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < uint8.byteLength; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      resolvedBase64 = btoa(binary);
      resolvedMimeType = fileRes.headers.get("content-type") || resolvedMimeType;
    }

    if (!resolvedBase64) {
      return new Response(
        JSON.stringify({ error: "Missing fileBase64 or fileUrl in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const CANDIDATE_MODELS = [
      "gemini-3.8-flash",
      "gemini-3.1-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
    ];

    const payload = {
      contents: [
        {
          parts: [
            { text: PROMPT_SPEC },
            {
              inlineData: {
                mimeType: resolvedMimeType,
                data: resolvedBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    };

    let resultJson = null;
    let modelUsed = null;
    let lastError = null;

    for (const model of CANDIDATE_MODELS) {
      const url = `${GEMINI_API_BASE}/${model}:generateContent?key=${apiKey}`;

      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const json = await response.json();
            const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
              resultJson = JSON.parse(candidateText);
              modelUsed = model;
              break;
            }
          }

          const errText = await response.text();
          lastError = `${model} HTTP ${response.status}: ${errText}`;
          if (response.status === 503 || response.status === 429) {
            break;
          }
        } catch (e) {
          lastError = e.message;
          break;
        }
      }
      if (resultJson) break;
    }

    if (!resultJson) {
      throw new Error(lastError || "All Gemini candidate models failed.");
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: resultJson,
        meta: {
          fileName: fileName || "uploaded_document",
          model: modelUsed,
          processedAt: new Date().toISOString(),
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
