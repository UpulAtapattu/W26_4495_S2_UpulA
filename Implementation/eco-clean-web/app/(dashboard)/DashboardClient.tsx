"use client";

import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  Modal,
  SegmentedControl,
  Stack,
  Title,
} from "@mantine/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { IoHandLeft, IoHandRight } from "react-icons/io5";
import { useEffect, useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import { useDisclosure } from "@mantine/hooks";
import randomColor from "randomcolor";
import NewJobModal from "../components/popups/JobModal";
import { CalendarSelection } from "@/types";
import { getJobs } from "@/lib/api/jobs";
import { useJobs } from "@/hooks/useJobs";

export default function DashboardClient() {
  const [opened, { open, close }] = useDisclosure(false);
  const { loading, jobs } = useJobs();
  const [calendarInfo, setCalendarInfo] = useState<CalendarSelection>({
    start: new Date(),
    end: new Date(),
    startStr: "",
    endStr: "",
    allDay: false,
  });

  const generateJobs = () => {
    const jobs = [];
    jobs.map((job) => {
      return {
        id: job.id,
        title: job.title,
        start: new Date("2026-02-18T09:00:00"),
        end: new Date("2026-02-18T13:00:00"),
        extendedProps: { status: "SCHEDULED" },
        color: randomColor({
          luminosity: "light",
        }),
      };
    });
  };

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Move-Out Cleaning - Test Client",
      start: new Date("2026-02-18T09:00:00"),
      end: new Date("2026-02-18T13:00:00"),
      extendedProps: { status: "SCHEDULED" },
      color: randomColor({
        luminosity: "light",
      }),
    },
    {
      id: "2",
      title: "Weekly Office Cleaning - Sarah Lee",
      start: new Date("2026-02-17T18:00:00"),
      end: new Date("2026-02-17T20:00:00"),
      extendedProps: { status: "COMPLETED" },
      color: randomColor({
        luminosity: "light",
      }),
    },
    {
      id: "3",
      title: "House Cleaning - David Nguyen",
      start: new Date("2026-02-19T10:00:00"),
      end: new Date("2026-02-19T12:00:00"),
      extendedProps: { status: "CANCELLED" },
      color: randomColor({
        luminosity: "light",
      }),
    },
  ]);

  const isOverlapping = (newStart: Date, newEnd: Date) => {
    return events.some((event) => {
      console.log(event);
      const existingStart = new Date(event.start);
      const existingEnd = new Date(event.end);

      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color: string;
    extendedProps: {
      status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "LATE";
    };
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setCalendarInfo(selectInfo);
    open();
  };

  const handleEventClick = (info) => {
    console.log(info);
    const event = info.event;

    // setSelectedRange({
    //   start: event.start!,
    //   end: event.end!,
    //   eventId: event.id,
    // });

    // setForm({
    //   title: event.title,
    //   status: event.extendedProps.status,
    // });

    // open();
  };

  return (
    <Container fluid>
      <NewJobModal
        selectedInfo={calendarInfo}
        opened={opened}
        onClose={close}
      />
      <h1>Dashboard</h1>
      <Stack gap="sm" mb="md">
        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Title order={4} c="dimmed">
              Cleaning Scheduling
            </Title>
            <Group gap="xs">
              <Title order={2}>February 2026</Title>
              <ActionIcon variant="subtle">
                <IoHandLeft size={18} />
              </ActionIcon>
              <ActionIcon variant="subtle">
                <IoHandRight size={18} />
              </ActionIcon>
              <Button variant="default" size="xs">
                Today
              </Button>
              <Button color="green" size="xs">
                Find a Time
              </Button>
            </Group>
          </Stack>

          <Group>
            <SegmentedControl
              size="xs"
              value="month"
              data={[
                { label: "Month", value: "month" },
                { label: "Week", value: "week" },
                { label: "Day", value: "day" },
              ]}
            />
          </Group>
        </Group>
      </Stack>

      {/* <Modal
        opened={opened}
        onClose={close}
        title="Appointment Details"
        closeOnClickOutside={false}
        centered
      ></Modal> */}
      <FullCalendar
        // headerToolbar={false}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        eventOverlap={true}
        selectOverlap={true}
        // headerToolbar={{
        //   left: "prev,next today",
        //   center: "title",
        //   right: "timeGridDay,timeGridWeek,dayGridMonth",
        // }}
        slotMinTime="00:00:00"
        slotMaxTime="23:59:00"
        slotDuration="00:30:00"
        editable
        select={handleDateSelect}
        selectable
        allDaySlot={false}
        nowIndicator
        events="/api/appointments"
        eventClick={handleEventClick}
        eventDrop={(info) => {
          console.log("Moved:", info.event.id, info.event.start);
        }}
        eventResize={(info) => {
          console.log("Resized:", info.event.id, info.event.end);
        }}
      />
    </Container>
  );
}
