import { NextRequest, NextResponse } from "next/server";
import {
  DOCTOR_CONSULTATIONS_LIST,
  DoctorConsultationItem,
  DoctorPrescriptionRecord,
} from "@/data/mockDoctorPortal";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ consultationId: string }> }
) {
  try {
    const { consultationId } = await context.params;
    const body = await request.json();

    const {
      fileName,
      fileType,
      fileData,
      fileSize,
      doctorId = "doc-1",
      doctorName = "Dr. Sharma, MD",
      patientId = "pat-1",
    } = body;

    if (!fileName || !fileData) {
      return NextResponse.json(
        { error: "Prescription fileName and fileData are required" },
        { status: 400 }
      );
    }

    const prescriptionRecord: DoctorPrescriptionRecord = {
      prescription_id: `rx-${Date.now()}`,
      consultation_id: consultationId,
      patient_id: patientId,
      doctor_id: doctorId,
      doctor_name: doctorName,
      file_name: fileName,
      file_type: fileType || "application/pdf",
      file_location: `storage/consultations/${consultationId}/prescriptions/${fileName}`,
      file_data: fileData,
      file_size: fileSize || "1.2 MB",
      uploaded_at: new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "Delivered",
    };

    return NextResponse.json({
      success: true,
      message: "Prescription uploaded and linked to consultation",
      prescription: prescriptionRecord,
    });
  } catch (error) {
    console.error("Prescription upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error uploading prescription" },
      { status: 500 }
    );
  }
}
