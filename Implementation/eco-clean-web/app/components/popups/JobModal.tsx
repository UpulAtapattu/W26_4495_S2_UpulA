"use client";

import {
  Modal,
  Stack,
  Grid,
  TextInput,
  Title,
  Text,
  Button,
  Group,
  Divider,
  Paper,
  Select,
  SegmentedControl,
  Textarea,
  NumberInput,
  Radio,
  Checkbox,
  Center,
  Box,
} from "@mantine/core";
import useSWR from "swr";
import { useState } from "react";
import { Client } from "../tables/ClientTable";
import { DateInput, TimeInput } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IoCalendarNumberOutline,
  IoCalendarOutline,
  IoHammerOutline,
  IoPersonOutline,
  IoRadioButtonOffOutline,
  IoReloadOutline,
  IoTextOutline,
  IoTimeOutline,
} from "react-icons/io5";
import { Dropzone } from "@mantine/dropzone";
import { useForm } from "@mantine/form";

interface Props {
  opened: boolean;
  onClose: () => void;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewJobModal({ opened, onClose }: Props) {
  const form = useForm({
    initialValues: {
      title: "",
      clientId: "",
      staffId: "",
      addressId: "",
      jobType: "ONE_OFF",

      startDate: null,
      startTime: "",
      endTime: "",
      isAnytime: false,
      visitInstructions: "",

      recurrence: {
        frequency: "weekly",
        interval: 1,
        endType: "after",
        endsAfter: 6,
        endsUnit: "months",
        endsOn: null,
      },

      lineItems: [],
      notes: "",
    },
    validate: {
      title: (value) =>
        value.trim().length < 3 ? "Title must be at least 3 characters" : null,
      clientId: (value) => (!value ? "Client is required" : null),
      staffId: (value) => (!value ? "Assignee is required" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
      startTime: (value, values) =>
        !values.isAnytime && !value
          ? "Start time required unless Anytime"
          : null,
      endTime: (value, values) => {
        if (values.isAnytime) return null;
        if (!value) return "End time is required";

        if (values.startTime && value <= values.startTime)
          return "End time must be after start time";

        return null;
      },
      recurrence: {
        interval: (value, values) =>
          values.jobType === "RECURRING" && (!value || value < 1)
            ? "Interval must be at least 1"
            : null,

        endsAfter: (value, values) =>
          values.jobType === "RECURRING" &&
          values.recurrence.endType === "after" &&
          (!value || value < 1)
            ? "Must be at least 1"
            : null,

        endsOn: (value, values) =>
          values.jobType === "RECURRING" &&
          values.recurrence.endType === "on" &&
          !value
            ? "End date required"
            : null,
      },
    },
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);

  const { data, isLoading } = useSWR(
    `/api/clients?q=${debouncedSearch}`,
    fetcher,
  );
  console.log("data", data);
  return (
    <Modal
      opened={opened}
      //opened={true}
      onClose={onClose}
      size="90%"
      radius="lg"
      title="New Job"
    >
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Paper p="sm">
          <Group justify="flex-end">
            <SegmentedControl
              color="green"
              value={form.values.jobType}
              onChange={(value) => form.setFieldValue("jobType", value)}
              data={[
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IoRadioButtonOffOutline />
                      <span>One off</span>
                    </Center>
                  ),

                  value: "ONE_OFF",
                },
                {
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IoReloadOutline />
                      <span>Recurring</span>
                    </Center>
                  ),
                  value: "RECURRING",
                },
              ]}
            />
          </Group>
          <TextInput
            leftSection={<IoTextOutline />}
            label="Title"
            placeholder="Job title"
            {...form.getInputProps("title")}
          />
          <Grid mt="sm">
            <Grid.Col span={6}>
              <Select
                leftSection={<IoPersonOutline />}
                searchValue={search}
                {...form.getInputProps("clientId")}
                label="Select a client"
                placeholder="Choose client"
                nothingFoundMessage="No clients found"
                data={
                  data?.data.map((client: Client) => ({
                    value: client.id,
                    label:
                      client.companyName ||
                      `${client.firstName} ${client.lastName}`,
                  })) || []
                }
                onSearchChange={setSearch}
                searchable
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                leftSection={<IoPersonOutline />}
                searchValue={search}
                {...form.getInputProps("staffId")}
                label="Select a assignee"
                placeholder="Choose staff member"
                nothingFoundMessage="No staff members found"
                data={
                  data?.data.map((client: Client) => ({
                    value: client.id,
                    label:
                      client.companyName ||
                      `${client.firstName} ${client.lastName}`,
                  })) || []
                }
                onSearchChange={setSearch}
                searchable
              />
            </Grid.Col>
          </Grid>
          <Divider my="md" />
          {form.values.jobType === "ONE_OFF" ? (
            <>
              {" "}
              <Grid>
                <Grid.Col span={4}>
                  <DateInput
                    label="Start date"
                    leftSection={<IoCalendarOutline />}
                    {...form.getInputProps("startDate")}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <TimeInput
                    label="Start time"
                    leftSection={<IoTimeOutline />}
                    {...form.getInputProps("startTime")}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <TimeInput
                    label="End time"
                    leftSection={<IoTimeOutline />}
                    {...form.getInputProps("endTime")}
                  />
                </Grid.Col>
              </Grid>
              <Checkbox
                my="md"
                label="Anytime"
                {...form.getInputProps("isAnytime", {
                  type: "checkbox",
                })}
              />
              <Textarea
                label="Visit instructions"
                minRows={3}
                {...form.getInputProps("visitInstructions")}
              />
            </>
          ) : (
            <>
              <Grid>
                <Grid.Col span={4}>
                  <DateInput
                    label="Start date"
                    {...form.getInputProps("startDate")}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <TimeInput
                    label="Start time"
                    {...form.getInputProps("startTime")}
                  />
                </Grid.Col>

                <Grid.Col span={4}>
                  <TimeInput
                    label="End time"
                    {...form.getInputProps("endTime")}
                  />
                </Grid.Col>
              </Grid>

              <Checkbox
                my="md"
                label="Anytime"
                {...form.getInputProps("isAnytime", {
                  type: "checkbox",
                })}
              />

              <Select
                label="Repeats"
                data={[
                  { value: "weekly", label: "Weekly" },
                  { value: "monthly", label: "Monthly" },
                ]}
                {...form.getInputProps("recurrence.frequency")}
              />

              <NumberInput
                label="Repeat every (interval)"
                min={1}
                {...form.getInputProps("recurrence.interval")}
              />

              <Radio.Group
                label="Ends"
                {...form.getInputProps("recurrence.endType")}
              >
                <Stack>
                  <Radio value="after" label="After" />

                  {form.values.recurrence.endType === "after" && (
                    <Group>
                      <NumberInput
                        min={1}
                        {...form.getInputProps("recurrence.endsAfter")}
                      />
                      <Select
                        data={[
                          { value: "months", label: "Months" },
                          { value: "weeks", label: "Weeks" },
                        ]}
                        {...form.getInputProps("recurrence.endsUnit")}
                      />
                    </Group>
                  )}

                  <Radio value="on" label="On date" />

                  {form.values.recurrence.endType === "on" && (
                    <DateInput {...form.getInputProps("recurrence.endsOn")} />
                  )}
                </Stack>
              </Radio.Group>

              <Textarea
                label="Visit instructions"
                minRows={3}
                {...form.getInputProps("visitInstructions")}
              />
            </>
          )}
        </Paper>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" color="green">
            Save Job
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
