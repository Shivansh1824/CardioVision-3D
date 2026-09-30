-- ====================================================================
-- CardioVision 3D — Supabase PostgreSQL Schema
-- Multimodal AI Hackathon 2026 (Track A)
-- ====================================================================

-- 1. Patients Table: Stores patient profiles & clinical biomarkers
CREATE TABLE IF NOT EXISTS public.patients (
    id SERIAL PRIMARY KEY,
    patient_code VARCHAR(50) UNIQUE NOT NULL,
    age INT NOT NULL,
    sex VARCHAR(10) NOT NULL,
    weight INT,
    length INT,
    bmi NUMERIC(5,2),
    bp INT NOT NULL,
    pr INT NOT NULL,
    dm INT DEFAULT 0,
    htn INT DEFAULT 0,
    current_smoker INT DEFAULT 0,
    ex_smoker INT DEFAULT 0,
    fh INT DEFAULT 0,
    obesity VARCHAR(5) DEFAULT 'N',
    crf VARCHAR(5) DEFAULT 'N',
    cva VARCHAR(5) DEFAULT 'N',
    airway_disease VARCHAR(5) DEFAULT 'N',
    thyroid_disease VARCHAR(5) DEFAULT 'N',
    chf VARCHAR(5) DEFAULT 'N',
    dlp VARCHAR(5) DEFAULT 'N',
    edema INT DEFAULT 0,
    weak_peripheral_pulse VARCHAR(5) DEFAULT 'N',
    lung_rales VARCHAR(5) DEFAULT 'N',
    systolic_murmur VARCHAR(5) DEFAULT 'N',
    diastolic_murmur VARCHAR(5) DEFAULT 'N',
    typical_chest_pain INT DEFAULT 0,
    dyspnea VARCHAR(5) DEFAULT 'N',
    function_class INT DEFAULT 0,
    atypical VARCHAR(5) DEFAULT 'N',
    nonanginal VARCHAR(5) DEFAULT 'N',
    exertional_cp VARCHAR(5) DEFAULT 'N',
    lowth_ang VARCHAR(5) DEFAULT 'N',
    q_wave INT DEFAULT 0,
    st_elevation INT DEFAULT 0,
    st_depression INT DEFAULT 0,
    tinversion INT DEFAULT 0,
    lvh VARCHAR(5) DEFAULT 'N',
    poor_r_progression VARCHAR(5) DEFAULT 'N',
    bbb VARCHAR(10) DEFAULT 'N',
    fbs INT NOT NULL,
    cr NUMERIC(4,2),
    tg INT,
    ldl INT NOT NULL,
    hdl NUMERIC(5,2),
    bun INT,
    esr INT,
    hb NUMERIC(4,2),
    k NUMERIC(4,2),
    na INT,
    wbc INT,
    lymph INT,
    neut INT,
    plt INT,
    ef_tte INT NOT NULL,
    region_rwma INT DEFAULT 0,
    vhd VARCHAR(10) DEFAULT 'N',
    -- Ground Truth Target Labels (Historical catheterization reference)
    cath VARCHAR(20),
    lad_ground_truth VARCHAR(20),
    lcx_ground_truth VARCHAR(20),
    rca_ground_truth VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Diagnostic Sessions Table: Stores AI prediction runs
CREATE TABLE IF NOT EXISTS public.diagnostic_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id INT REFERENCES public.patients(id) ON DELETE CASCADE,
    cad_risk_pct NUMERIC(5,2) NOT NULL,
    lad_risk_pct NUMERIC(5,2) NOT NULL,
    lcx_risk_pct NUMERIC(5,2) NOT NULL,
    rca_risk_pct NUMERIC(5,2) NOT NULL,
    cad_classification VARCHAR(20) NOT NULL,
    lad_status VARCHAR(20) NOT NULL,
    lcx_status VARCHAR(20) NOT NULL,
    rca_status VARCHAR(20) NOT NULL,
    shap_explanations JSONB,
    input_snapshot JSONB,
    clinician_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Treatment Simulations Table: Stores "What-If" intervention plans
CREATE TABLE IF NOT EXISTS public.treatment_simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.diagnostic_sessions(id) ON DELETE CASCADE,
    patient_id INT REFERENCES public.patients(id) ON DELETE CASCADE,
    baseline_bp INT NOT NULL,
    target_bp INT NOT NULL,
    baseline_ldl INT NOT NULL,
    target_ldl INT NOT NULL,
    smoker_intervention BOOLEAN DEFAULT FALSE,
    baseline_cad_risk NUMERIC(5,2) NOT NULL,
    simulated_cad_risk NUMERIC(5,2) NOT NULL,
    baseline_lad_risk NUMERIC(5,2) NOT NULL,
    simulated_lad_risk NUMERIC(5,2) NOT NULL,
    risk_reduction_pct NUMERIC(5,2) NOT NULL,
    plan_title VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) & Public Read Access for Web Client
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_simulations ENABLE ROW LEVEL SECURITY;

-- Allow anon public read for patients (to display in demo app)
CREATE POLICY "Allow public read access for patients" ON public.patients
    FOR SELECT TO anon, authenticated USING (true);

-- Allow anon public insert/read for diagnostic sessions & simulations
CREATE POLICY "Allow public all access on diagnostic_sessions" ON public.diagnostic_sessions
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow public all access on treatment_simulations" ON public.treatment_simulations
    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_patients_code ON public.patients(patient_code);
CREATE INDEX IF NOT EXISTS idx_diagnostic_patient ON public.diagnostic_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_simulations_patient ON public.treatment_simulations(patient_id);
