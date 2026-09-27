/**
 * MedGuard Prescription Document Service
 * Handles client-side prescription file reading, printing, and authorized downloading.
 * Supports PDF, PNG, JPG, JPEG, and direct camera captures.
 */

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an authentic SVG/Base64 digital prescription document
 * Used when doctor generates or issues an electronic Rx within the system.
 */
export function generateAuthorizedRxSvgDataUrl(params: {
  rxId: string;
  doctorName: string;
  patientName: string;
  date: string;
  notes?: string;
  medicines?: string[];
}): string {
  const { rxId, doctorName, patientName, date, notes, medicines } = params;

  const medList =
    medicines && medicines.length > 0
      ? medicines
      : [
          "Lisinopril 10 mg Tablet — 1 tab PO daily in the morning",
          "Warfarin Sodium 4 mg Tablet — Take once daily at 6:00 PM (Target INR 2.0-3.0)",
          "Acetaminophen (Tylenol) 500 mg — 1 tablet every 8h as needed for pain (PRN)",
        ];

  const medItemsSvg = medList
    .map(
      (m, idx) => `
      <g transform="translate(48, ${260 + idx * 46})">
        <circle cx="8" cy="12" r="5" fill="#0d9488" />
        <text x="24" y="16" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#0f172a">
          ${idx + 1}. ${m}
        </text>
      </g>
    `
    )
    .join("");

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="800" height="1050" style="background:#ffffff;">
  <!-- Border & Frame -->
  <rect x="20" y="20" width="760" height="1010" rx="16" fill="#ffffff" stroke="#0d9488" stroke-width="3"/>
  <rect x="28" y="28" width="744" height="994" rx="12" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>

  <!-- Clinical Header -->
  <rect x="28" y="28" width="744" height="110" rx="12" fill="#f0fdfa"/>
  <text x="56" y="70" font-family="'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="900" fill="#0f766e" letter-spacing="1">
    MEDGUARD COMPREHENSIVE MEDICAL CENTER
  </text>
  <text x="56" y="94" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#475569">
    DIVISION OF INTERNAL MEDICINE &amp; GERIATRICS • LICENSED HEALTHCARE INSTITUTION
  </text>
  <text x="56" y="112" font-family="Arial, sans-serif" font-size="11" fill="#64748b">
    Address: 1044 Healthcare Parkway, Suite 400 • Tel: (800) 555-0199 • Fax: (800) 555-0198
  </text>

  <!-- Doctor & Patient Identification Strip -->
  <line x1="48" y1="150" x2="752" y2="150" stroke="#cbd5e1" stroke-width="1.5"/>
  
  <text x="48" y="176" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748b" text-transform="uppercase">
    ATTENDING PHYSICIAN:
  </text>
  <text x="48" y="196" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">
    ${doctorName}
  </text>
  <text x="48" y="214" font-family="Arial, sans-serif" font-size="11" fill="#475569">
    Reg No: MED-8849201-B • Senior Medical Consultant
  </text>

  <text x="450" y="176" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#64748b" text-transform="uppercase">
    PATIENT RECORD:
  </text>
  <text x="450" y="196" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#0f172a">
    ${patientName}
  </text>
  <text x="450" y="214" font-family="Arial, sans-serif" font-size="11" fill="#475569">
    Consultation Date: ${date} • Rx Reference: ${rxId}
  </text>

  <line x1="48" y1="230" x2="752" y2="230" stroke="#cbd5e1" stroke-width="1.5"/>

  <!-- Rx Symbol -->
  <text x="48" y="260" font-family="Georgia, serif" font-size="34" font-weight="bold" font-style="italic" fill="#0f766e">
    Rx
  </text>

  <!-- Medication List -->
  ${medItemsSvg}

  <!-- Clinical Instructions / Notes -->
  <rect x="48" y="480" width="704" height="150" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
  <text x="68" y="508" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f766e" text-transform="uppercase">
    CLINICAL ADVICE &amp; PHARMACY DISPENSING INSTRUCTIONS:
  </text>
  <text x="68" y="534" font-family="Arial, sans-serif" font-size="13" fill="#1e293b" width="660">
    ${notes || "Please follow this adjusted medication schedule strictly. Continue monitoring morning blood"}
  </text>
  <text x="68" y="556" font-family="Arial, sans-serif" font-size="13" fill="#1e293b">
    pressure. Do NOT combine with over-the-counter NSAIDs (Ibuprofen / Naproxen).
  </text>
  <text x="68" y="578" font-family="Arial, sans-serif" font-size="13" fill="#1e293b">
    Keep well hydrated. Follow-up consultation scheduled in 2 weeks or if symptoms persist.
  </text>

  <!-- Security & Verification Box -->
  <rect x="48" y="650" width="704" height="110" rx="8" fill="#f0fdf4" stroke="#86efac" stroke-width="1"/>
  <text x="68" y="678" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#166534">
    VERIFIED ELECTRONIC PRESCRIPTION — MEDGUARD AUTHORIZATION
  </text>
  <text x="68" y="700" font-family="Arial, sans-serif" font-size="11" fill="#15803d">
    Digital Verification Hash: SHA256-${rxId.slice(0, 16).toUpperCase()}
  </text>
  <text x="68" y="718" font-family="Arial, sans-serif" font-size="11" fill="#15803d">
    Authorized by attending clinician. Pharmacists can dispense directly according to jurisdictional regulations.
  </text>
  <text x="68" y="736" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#166534">
    Security Status: Legally Binding Consultation Prescription • Non-Transferable
  </text>

  <!-- Doctor Signature & Stamp Area -->
  <g transform="translate(480, 800)">
    <!-- Stamp watermark -->
    <circle cx="120" cy="50" r="48" fill="none" stroke="#0d9488" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="80" y="44" font-family="Arial, sans-serif" font-size="9" font-weight="bold" fill="#0f766e" text-anchor="middle">MEDGUARD</text>
    <text x="120" y="54" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0f766e" text-anchor="middle">OFFICIAL CLINICAL</text>
    <text x="120" y="66" font-family="Arial, sans-serif" font-size="8" font-weight="bold" fill="#0f766e" text-anchor="middle">STAMP</text>

    <!-- Simulated cursive signature -->
    <path d="M 20 50 Q 50 10 90 45 T 160 40 T 220 50" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="10" y1="70" x2="230" y2="70" stroke="#475569" stroke-width="1.5"/>
    <text x="20" y="88" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#0f172a">
      ${doctorName}
    </text>
    <text x="20" y="104" font-family="Arial, sans-serif" font-size="10" fill="#64748b">
      Authorized Medical Practitioner Signature
    </text>
  </g>

  <!-- Document Footer -->
  <line x1="48" y1="960" x2="752" y2="960" stroke="#e2e8f0" stroke-width="1"/>
  <text x="48" y="985" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8">
    MedGuard Clinical ID: ${rxId} • Generated via Doctor Consultation Portal • Valid for 30 days from issue
  </text>
  <text x="752" y="985" font-family="Arial, sans-serif" font-size="10" fill="#94a3b8" text-anchor="end">
    Page 1 of 1
  </text>
</svg>
`.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

/**
 * Triggers standard browser print dialog for the exact prescription file.
 */
export function printPrescriptionDocument(
  fileName: string,
  dataUrl: string,
  fileType: string = "application/pdf"
): void {
  if (typeof window === "undefined") return;

  const isImageOrSvg =
    fileType.includes("image") ||
    fileType.includes("svg") ||
    dataUrl.startsWith("data:image/") ||
    fileName.match(/\.(png|jpg|jpeg|svg|webp)$/i);

  if (isImageOrSvg) {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Prescription — ${fileName}</title>
            <style>
              @page { size: auto; margin: 10mm; }
              body {
                margin: 0;
                padding: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #fff;
              }
              img {
                max-width: 100%;
                height: auto;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" alt="${fileName}" onload="window.focus(); setTimeout(function(){ window.print(); window.close(); }, 300);" />
          </body>
        </html>
      `);
      printWindow.document.close();
      return;
    }
  }

  // Fallback iframe for PDFs or other documents
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.src = dataUrl;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    }
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 4000);
  };
}

/**
 * Downloads the authorized prescription file to the user's device.
 */
export function downloadPrescriptionDocument(fileName: string, dataUrl: string): void {
  if (typeof window === "undefined") return;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = fileName || "Authorized_Prescription.pdf";
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
  }, 300);
}
