"use client";

import { Container } from "@mantine/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function DashboardClient() {
  return (
    <Container size="lg">
      <h1>Dashboard</h1>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        showNonCurrentDates
        events={[
          { title: "Meeting", start: "2026-02-05T10:00:00" },
          { title: "Appointment", start: "2026-02-05T11:00:00" },
        ]}
      />
    </Container>
  );
}
