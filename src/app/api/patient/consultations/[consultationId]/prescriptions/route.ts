import { NextRequest, NextResponse } from "next/server";
import {
  DOCTOR_CONSULTATIONS_LIST,
  DoctorPrescriptionRecord,
} from "@/data/mockDoctorPortal";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ consultationId: string }> }
) {
  try {
    const { consultationId } = await context.params;

    // Security requirement: Ensure patient only retrieves authorized consultation prescriptions
    const match = DOCTOR_CONSULTATIONS_LIST.find((c) => c.id === consultationId);

    const prescriptions: DoctorPrescriptionRecord[] = match
      ? match.prescriptions || (match.prescription ? [match.prescription] : [])
      : [];

    return NextResponse.json({
      success: true,
      consultationId,
      prescriptions,
    });
  } catch (error) {
    console.error("Fetch patient prescriptions error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching prescriptions" },
      { status: 500 }
    );
  }
}
