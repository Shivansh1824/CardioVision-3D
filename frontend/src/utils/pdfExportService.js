import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * pdfExportService.js
 * 
 * Generates and downloads a high-fidelity A4 clinical summary PDF
 * from a DOM element using html2canvas and jsPDF.
 */
export async function downloadElementAsPdf(elementId, fileName = 'CardioVision3D_Clinical_Report.pdf') {
  const element = typeof elementId === 'string' ? document.getElementById(elementId) : elementId;
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  // Create canvas with 2x retina scale for crisp typography and clean lines
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // Standard A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Multi-page handling if report exceeds 1 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  pdf.save(fileName);
  return true;
}
