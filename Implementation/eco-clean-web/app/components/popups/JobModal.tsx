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
  Box,
} from "@mantine/core";
import useSWR from "swr";
import { useState } from "react";
import { Client } from "../tables/ClientTable";
import { useDebouncedValue } from "@mantine/hooks";

interface Props {
  opened: boolean;
  onClose: () => void;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function NewJobModal({ opened, onClose }: Props) {
  const [jobType, setJobType] = useState("one-off");
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
      onClose={onClose}
      size="90%"
      radius="lg"
      padding="xl"
      title="New Job"
    >
      <Stack gap="xl">
        <Stack gap="md">
          <TextInput label="Title" placeholder="Job title" />

          <Grid>
            <Grid.Col span={6}>
              <Select
                searchValue={search}
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

            <Grid.Col span={3}>
              <TextInput label="Job #" placeholder="Auto" />
            </Grid.Col>

            <Grid.Col span={3}>
              <TextInput label="Salesperson" placeholder="Assign" />
            </Grid.Col>
          </Grid>
        </Stack>

        <Divider />

        {/* ================== JOB TYPE ================== */}
        <Paper withBorder radius="md" p="lg">
          <Stack>
            <Group justify="space-between">
              <Title order={4}>Job type</Title>
            </Group>

            <SegmentedControl
              value={jobType}
              onChange={setJobType}
              data={[
                { label: "One-off", value: "one-off" },
                { label: "Recurring", value: "recurring" },
              ]}
              w={250}
            />
          </Stack>
        </Paper>

        {/* ================== SCHEDULE ================== */}
        <Paper withBorder radius="md" p="lg">
          <Stack gap="md">
            <Title order={4}>Schedule</Title>

            <Grid>
              <Grid.Col span={4}>
                <TextInput label="Start date" placeholder="Select date" />
              </Grid.Col>

              <Grid.Col span={4}>
                <TextInput label="Start time" placeholder="Start time" />
              </Grid.Col>

              <Grid.Col span={4}>
                <TextInput label="End time" placeholder="End time" />
              </Grid.Col>
            </Grid>

            {jobType === "recurring" && (
              <>
                <Select
                  label="Repeats"
                  placeholder="Weekly on Tuesdays"
                  data={["Daily", "Weekly", "Monthly", "Custom"]}
                />

                <Select
                  label="Ends"
                  placeholder="Ends after"
                  data={["After 6 months", "After 1 year", "Never"]}
                />
              </>
            )}
          </Stack>
        </Paper>

        {/* ================== BILLING (EMPTY FOR NOW) ================== */}
        <Paper withBorder radius="md" p="lg">
          <Stack>
            <Title order={4}>Billing & automatic payments</Title>
            <Text c="dimmed">(Billing section coming soon)</Text>
          </Stack>
        </Paper>

        {/* ================== PRODUCT / SERVICE ================== */}
        <Paper withBorder radius="md" p="lg">
          <Stack>
            <Title order={4}>Product / Service</Title>

            <Grid>
              <Grid.Col span={4}>
                <TextInput label="Name" />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput label="Quantity" />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput label="Unit cost" />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput label="Unit price" />
              </Grid.Col>
              <Grid.Col span={2}>
                <TextInput label="Total" />
              </Grid.Col>
            </Grid>

            <Textarea label="Description" minRows={3} />

            <Button variant="light" w={160}>
              Add Line Item
            </Button>
          </Stack>
        </Paper>

        {/* ================== NOTES ================== */}
        <Paper withBorder radius="md" p="lg">
          <Stack>
            <Title order={4}>Notes</Title>
            <Textarea placeholder="Leave a note" minRows={4} />
          </Stack>
        </Paper>

        {/* ================== FOOTER ================== */}
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="green">Save Job</Button>
        </Group>
      </Stack>
    </Modal>
  );
}
