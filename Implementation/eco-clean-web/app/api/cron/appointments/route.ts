import { runReminders } from "@/lib/appointments/reminders";

export async function GET() {
  try {
    await runReminders();
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Cron failed:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}
