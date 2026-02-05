import { prisma } from "@/lib/prisma";
import { addDays, startOfHour, endOfHour } from "date-fns";
import { send3DayReminder, send1DayReminder } from "../appointments/";

export async function runReminders(now = new Date()) {
  console.log("reminders");
  const target = addDays(now, 3);
  const appointments = await prisma.appointment.findMany({
    where: {
      status: "SCHEDULED",
      reminder5dSent: false,
      startTime: {
        gte: startOfHour(target),
        lt: endOfHour(target),
      },
    },
    include: {
      client: true, // to get email
    },
  });
  for (const appt of appointments) {
    try {
      await send3DayReminder(appt);

      await prisma.appointment.update({
        where: { id: appt.id },
        data: { reminder5dSent: true },
      });
    } catch (err) {
      console.error("3-day reminder failed", appt.id, err);
    }
  }
}
