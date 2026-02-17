import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      clientId,
      staffId = [],
      addressId,
      jobType,
      startDate,
      startTime,
      endTime,
      isAnytime,
      recurrence,
      visitInstructions,
    } = body;

    if (!title || !clientId || !addressId || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Combine date + time
    const start = new Date(startDate);
    const end = new Date(startDate);

    if (!isAnytime) {
      if (!startTime || !endTime) {
        return NextResponse.json(
          { error: "Start and End time required" },
          { status: 400 },
        );
      }

      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);

      start.setHours(sh, sm, 0, 0);
      end.setHours(eh, em, 0, 0);

      if (end <= start) {
        return NextResponse.json(
          { error: "End time must be after start time" },
          { status: 400 },
        );
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const duration = end.getTime() - start.getTime();

      const job = await tx.job.create({
        data: {
          title,
          type: jobType,
          clientId,
          addressId,
          isAnytime,
          visitInstructions,
          staffMembers: {
            connect: staffId.map((id: string) => ({ id })),
          },
        },
      });

      if (jobType === "ONE_OFF") {
        await tx.appointment.create({
          data: {
            jobId: job.id,
            startTime: start,
            endTime: end,
            status: AppointmentStatus.SCHEDULED,
          },
        });
      }

      if (jobType === "RECURRING") {
        const { frequency, interval, endType, endsOn } = recurrence;

        await tx.recurrence.create({
          data: {
            jobId: job.id,
            frequency,
            interval,
            endType,
            endsOn: endType === "on" && endsOn ? new Date(endsOn) : null,
          },
        });

        const appointments = [];
        const current = new Date(start);

        let safetyCounter = 0;

        while (true) {
          if (endType === "on" && endsOn && current > new Date(endsOn)) break;
          if (safetyCounter > 500) break; // prevent infinite loop

          appointments.push({
            jobId: job.id,
            startTime: new Date(current),
            endTime: new Date(current.getTime() + duration),
            status: "SCHEDULED",
          });

          if (frequency === "weekly") {
            current.setDate(current.getDate() + 7 * interval);
          }

          if (frequency === "monthly") {
            current.setMonth(current.getMonth() + interval);
          }

          safetyCounter++;
        }

        if (appointments.length) {
          await tx.appointment.createMany({
            data: appointments,
          });
        }
      }

      return job;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Create Job Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const clientId = searchParams.get("clientId");
    const type = searchParams.get("type"); // ONE_OFF | RECURRING

    const jobs = await prisma.job.findMany({
      where: {
        ...(clientId && { clientId }),
        ...(type && { type: type }),
      },
      include: {
        client: true,
        address: true,
        staffMembers: true,
        recurrence: true,
        appointments: {
          orderBy: {
            startTime: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("GET Jobs Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
