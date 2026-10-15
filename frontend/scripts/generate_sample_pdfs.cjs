const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '../public/samples');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// -------------------------------------------------------------------------
// 1. GENERATE VALID REPORT: sample_cardiac_diagnostic_report.pdf
// -------------------------------------------------------------------------
function generateCardiacReport() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(2, 132, 199); // medical sky blue
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Institution Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('METROPOLITAN CARDIOLOGY & DIAGNOSTIC INSTITUTE', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('CLINICAL CARDIOLOGY · ADVANCED NON-INVASIVE IMAGING · ACCREDITED LAB #CLIA-99214', 14, 18);
  doc.text('452 Innovation Blvd, Medical Center Hub | Secure EHR Integration: HL7/FHIR Compliant', 14, 23);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('COMPREHENSIVE CARDIOVASCULAR BIOMARKER REPORT', 14, 38);

  // Patient Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 42, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT INFORMATION', 18, 48);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  // Col 1
  doc.text('Patient Name: ', 18, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('Robert H. Vance', 42, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('Patient ID: ', 18, 61);
  doc.setFont('helvetica', 'bold');
  doc.text('CV-2026-8842', 42, 61);
  doc.setFont('helvetica', 'normal');
  doc.text('Age / Gender: ', 18, 66);
  doc.setFont('helvetica', 'bold');
  doc.text('61 Yrs / Male', 42, 66);

  // Col 2
  doc.setFont('helvetica', 'normal');
  doc.text('Report Date: ', 100, 55);
  doc.setFont('helvetica', 'bold');
  doc.text('October 14, 2026', 124, 55);
  doc.setFont('helvetica', 'normal');
  doc.text('Referring MD: ', 100, 61);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Sarah Jenkins, MD, FACC', 124, 61);
  doc.setFont('helvetica', 'normal');
  doc.text('Indication: ', 100, 66);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('Exertional Angina & Multi-Vessel CAD Screening', 124, 66);

  let y = 76;

  // SECTION 1: BLOOD BIOCHEMISTRY & LIPID PANEL
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 1: BLOOD BIOCHEMISTRY & SERUM LIPID PROFILE (FASTING)', 17, y + 5);

  y += 11;
  // Table Header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Biomarker Parameter', 18, y + 4.2);
  doc.text('Result Value', 75, y + 4.2);
  doc.text('Reference Interval', 115, y + 4.2);
  doc.text('Clinical Interpretation', 155, y + 4.2);

  const labRows = [
    { name: 'Total Cholesterol', val: '242 mg/dL', ref: '< 200 mg/dL', flag: 'High (Borderline)', col: [217, 119, 6] },
    { name: 'LDL Cholesterol', val: '164 mg/dL', ref: '< 100 mg/dL', flag: 'Elevated Risk (Critical)', col: [185, 28, 28] },
    { name: 'HDL Cholesterol', val: '34 mg/dL', ref: '> 40 mg/dL', flag: 'Suboptimal / Low', col: [185, 28, 28] },
    { name: 'Triglycerides (TG)', val: '228 mg/dL', ref: '< 150 mg/dL', flag: 'High', col: [217, 119, 6] },
    { name: 'Fasting Blood Sugar (FBS)', val: '148 mg/dL', ref: '70 - 99 mg/dL', flag: 'Impaired / Diabetic Range', col: [185, 28, 28] },
    { name: 'Serum Creatinine (Cr)', val: '1.15 mg/dL', ref: '0.70 - 1.30 mg/dL', flag: 'Normal Renal Clearance', col: [22, 101, 52] },
    { name: 'Blood Urea Nitrogen (BUN)', val: '19.0 mg/dL', ref: '7.0 - 20.0 mg/dL', flag: 'Normal', col: [22, 101, 52] },
    { name: 'Hemoglobin (Hb)', val: '14.2 g/dL', ref: '13.5 - 17.5 g/dL', flag: 'Normal', col: [22, 101, 52] },
  ];

  y += 6;
  labRows.forEach((row, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 5.5, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(row.name, 18, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.text(row.val, 75, y + 4);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(row.ref, 115, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...row.col);
    doc.text(row.flag, 155, y + 4);
    y += 5.5;
  });

  y += 4;
  // SECTION 2: 12-LEAD RESTING ELECTROCARDIOGRAM (ECG)
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 2: 12-LEAD RESTING ELECTROCARDIOGRAM (ECG) FINDINGS', 17, y + 5);

  y += 10;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, y, pageWidth - 28, 26, 1.5, 1.5, 'FD');

  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('• Rhythm & Rate: ', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.text('Normal Sinus Rhythm at 78 bpm. PR Interval: 164 ms | QRS Duration: 96 ms | QTc: 442 ms.', 48, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('• ST-Segment Changes: ', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Horizontal ST-Depression (1.4 mm) present in lateral precordial leads (V4, V5, V6).', 53, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('• T-Wave & Inversion: ', 18, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('Symmetric T-Wave Inversion observed in inferior leads (II, III, aVF). Pathological Q in Lead III.', 52, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('• Hypertrophy / Conduction: ', 18, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.text('Sokolow-Lyon voltage criteria positive for Left Ventricular Hypertrophy (LVH). No BBB.', 58, y + 23);

  y += 30;
  // SECTION 3: 2D TRANSTHORACIC ECHOCARDIOGRAM (TTE)
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('SECTION 3: 2D TRANSTHORACIC ECHOCARDIOGRAPHY (TTE) QUANTITATION', 17, y + 5);

  y += 10;
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(14, y, pageWidth - 28, 25, 1.5, 1.5, 'FD');

  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);

  doc.setFont('helvetica', 'bold');
  doc.text('• Ejection Fraction (LVEF): ', 18, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('46% (Moderately Depressed; Biplane Simpson Method, normal >= 55%)', 57, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('• Regional Wall Motion (RWMA): ', 18, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.text('Hypokinesis localized to anterior mid-cavity & apical septum (suggestive of LAD territory ischemia).', 65, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.text('• Valvular Heart Disease (VHD): ', 18, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.text('Mild Aortic Valve Sclerosis; Trace-to-Mild Mitral Regurgitation (Grade 1 VHD).', 63, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.text('• Diastolic Filling: ', 18, y + 23);
  doc.setFont('helvetica', 'normal');
  doc.text('Grade I impaired relaxation pattern (E/A ratio 0.72).', 47, y + 23);

  y += 29;
  // CLINICAL IMPRESSION & RECOMMENDATION
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(153, 246, 228);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text('SYNTHESIS & CLINICAL IMPRESSION FOR ML TRIAGE:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const impressionText =
    'Electrocardiographic lateral ST-depression and T-wave inversion combined with atherogenic dyslipidemia (LDL 164, TG 228), diabetes (FBS 148), and echo wall motion abnormality strongly point toward severe obstructive multi-vessel coronary artery disease. Immediate quantitative 3D coronary vascular triage and multi-vessel stenosis risk prediction (LAD, LCX, RCA) recommended.';
  const splitImp = doc.splitTextToSize(impressionText, pageWidth - 36);
  doc.text(splitImp, 18, y + 12);

  // Footer & Signatures
  y = 268;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Verified by: Dr. Marcus Sterling, MD, FACC', 18, y + 6);
  doc.text('Accreditation: CAP / CLIA #05D2049182', pageWidth - 70, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('CardioVision 3D Multimodal Diagnostic Intake · Document Hash: SHA256-CAD-8842-VALID · Page 1 of 1', 18, y + 11);

  const filePath = path.join(outputDir, 'sample_cardiac_diagnostic_report.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log(`✓ Created: ${filePath}`);
}

// -------------------------------------------------------------------------
// 2. GENERATE INVALID / UNRELATED REPORT: sample_unrelated_document.pdf
// -------------------------------------------------------------------------
function generateUnrelatedReport() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Green accent line (dental/commercial feel)
  doc.setFillColor(16, 185, 129); // emerald
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Institution Header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('APEX DENTAL STUDIO & COSMETIC DENTISTRY', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('PRACTICE LICENSE #DEN-48201 · GENERAL & PREVENTIVE ORAL HEALTH', 14, 18);
  doc.text('880 Pine Crest Way, Suite 400 | Office Ph: (555) 392-8810 | info@apexdentalstudio.example', 14, 23);

  // Document Title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PATIENT BILLING INVOICE & HYGIENE RECEIPT', 14, 38);

  // Invoice Meta Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 43, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('BILLING ACCOUNT DETAILS', 18, 49);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);

  // Col 1
  doc.text('Client / Patient: ', 18, 56);
  doc.setFont('helvetica', 'bold');
  doc.text('Robert Vance', 44, 56);
  doc.setFont('helvetica', 'normal');
  doc.text('Account Number: ', 18, 62);
  doc.setFont('helvetica', 'bold');
  doc.text('DENT-ACC-9041', 44, 62);

  // Col 2
  doc.setFont('helvetica', 'normal');
  doc.text('Invoice Date: ', 110, 56);
  doc.setFont('helvetica', 'bold');
  doc.text('October 12, 2026', 134, 56);
  doc.setFont('helvetica', 'normal');
  doc.text('Payment Status: ', 110, 62);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('PAID IN FULL (VISA ending *4912)', 134, 62);

  let y = 77;

  // ITEMIZATION TABLE
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('ITEMIZED DENTAL SERVICES & PROCEDURES', 17, y + 5);

  y += 11;
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 6, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('ADA Code', 18, y + 4.2);
  doc.text('Procedure Description', 45, y + 4.2);
  doc.text('Tooth / Quad', 125, y + 4.2);
  doc.text('Amount (USD)', 160, y + 4.2);

  const dentalItems = [
    { code: 'D1110', desc: 'Adult Prophylaxis (Routine Scale & Polish)', tooth: 'Full Mouth', amt: '$145.00' },
    { code: 'D0120', desc: 'Periodic Oral Evaluation & Examination', tooth: 'General', amt: '$65.00' },
    { code: 'D0274', desc: 'Bitewing Radiographs (Four Images)', tooth: 'Posterior', amt: '$85.00' },
    { code: 'D1206', desc: 'Topical Application of Fluoride Varnish', tooth: 'Full Mouth', amt: '$45.00' },
  ];

  y += 6;
  dentalItems.forEach((item, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 6, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(item.code, 18, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(item.desc, 45, y + 4.2);
    doc.text(item.tooth, 125, y + 4.2);

    doc.setFont('helvetica', 'bold');
    doc.text(item.amt, 160, y + 4.2);
    y += 6.5;
  });

  // Total summary
  y += 2;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Total Invoiced Amount:', 115, y);
  doc.setTextColor(16, 185, 129);
  doc.text('$340.00', 165, y);

  y += 12;
  // CLINICAL HYGIENE SUMMARY NOTES
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 48, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('ORAL HYGIENE & CLINICAL EXAMINATION SUMMARY:', 18, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(30, 41, 59);

  const notes = [
    '• Gingival tissues appear pink, firm, and stippled with normal scalloped margins.',
    '• Mild supragingival calculus observed on lingual surfaces of mandibular anterior teeth (#23-#26).',
    '• Periodontal pocket depths range from 2 mm to 3 mm throughout all quadrants; no bleeding on probing.',
    '• Radiographs review: No interproximal caries, bone height within normal limits for age.',
    '• Occlusal wear facet noted on maxillary premolars; no treatment indicated at this time.',
    '• Next scheduled preventive recall: April 2027 (6-month prophylaxis).',
  ];

  let noteY = y + 14;
  notes.forEach((n) => {
    doc.text(n, 18, noteY);
    noteY += 5.5;
  });

  // Warning Notice for AI
  y += 56;
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(254, 202, 202);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(185, 28, 28);
  doc.text('ATTENTION: NON-CARDIAC DOCUMENT (FOR SYSTEM VERIFICATION)', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(127, 29, 29);
  const warnText =
    'This file is a commercial dental receipt and oral evaluation summary. It contains zero cardiac biomarkers, no blood chemistry (LDL/HDL/TG/FBS), no 12-lead electrocardiogram waveforms, and no echocardiographic ejection fraction data. Uploading this to CardioVision 3D must trigger the invalid document error filter.';
  const splitWarn = doc.splitTextToSize(warnText, pageWidth - 36);
  doc.text(splitWarn, 18, y + 11);

  // Footer & Signatures
  y = 268;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Attending Dentist: Dr. Nathan Miller, DDS (License #DDS-77492)', 18, y + 6);
  doc.text('Payment Gateway: Square POS Terminal #8841', pageWidth - 70, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('Receipt ID: REC-9041-DENTAL · Generated for Hackathon Negative Test Verification · Page 1 of 1', 18, y + 11);

  const filePath = path.join(outputDir, 'sample_unrelated_document.pdf');
  fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));
  console.log(`✓ Created: ${filePath}`);
}

generateCardiacReport();
generateUnrelatedReport();
