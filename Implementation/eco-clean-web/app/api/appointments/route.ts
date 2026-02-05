import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log("GET");
  const appointments = await prisma.appointment.findMany({
    include: {
      client: true,
      staff: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { startTime, endTime, address, clientId, staffId, price } = body;

    if (
      !startTime ||
      !endTime ||
      !address ||
      !clientId ||
      !staffId ||
      price == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        address,
        clientId,
        staffId,
        price,
        status: "SCHEDULED",
        reminder5dSent: false,
        reminder1dSent: false,
        completionSent: false,
      },
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("Create appointment error:", error);

    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}
