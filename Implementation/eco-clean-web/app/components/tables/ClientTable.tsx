"use client";

import {
  Table,
  TextInput,
  Group,
  Text,
  ScrollArea,
  Center,
  Box,
  ActionIcon,
  Badge,
  Collapse,
  Stack,
} from "@mantine/core";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  IoSearchOutline,
  IoChevronDown,
  IoChevronForward,
} from "react-icons/io5";

type Props = {
  clients: Client[];
};

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  preferredContact?: "call" | "sms" | "email";
  leadSource?: string;
  createdAt: string;
};

export const getClientName = (c: Client) => `${c.firstName} ${c.lastName}`;

export default function ClientsTable({ clients }: Props) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const [expanded, setExpanded] = useState<string | null>(null);

  const renderPreferredContact = (method?: "call" | "sms" | "email") => {
    if (!method) return "—";
    return method.toUpperCase();
  };

  const renderValue = (value?: string) => (value?.length ? value : "—");

  const filteredClients = useMemo(() => {
    const q = query.toLowerCase().trim();

    if (!q) return clients;

    return clients.filter((c) =>
      [getClientName(c), c.email, c.phone].join(" ").toLowerCase().includes(q),
    );
  }, [clients, query]);
  if (!clients.length) {
    return (
      <Center py="xl">
        <Text c="dimmed">No clients found</Text>
      </Center>
    );
  }

  return (
    <Box>
      {/* Search */}
      <Group mb="md">
        <TextInput
          placeholder="Search clients…"
          leftSection={<IoSearchOutline size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          w={300}
        />
      </Group>

      {/* Table */}
      <ScrollArea>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Client</Table.Th>
              <Table.Th>Company</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Preferred</Table.Th>
              <Table.Th>Lead source</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredClients.map((client) => (
              <Table.Tr
                key={client.id}
                onClick={() => router.push(`/clients/${client.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Table.Td>
                  <Text fw={500}>{getClientName(client)}</Text>
                </Table.Td>

                <Table.Td>{renderValue(client.companyName)}</Table.Td>

                <Table.Td>{client.email}</Table.Td>

                <Table.Td>{client.phone}</Table.Td>

                <Table.Td>
                  {renderPreferredContact(client.preferredContact)}
                </Table.Td>

                <Table.Td>{renderValue(client.leadSource)}</Table.Td>

                <Table.Td>
                  {new Date(client.createdAt).toLocaleDateString()}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Empty search result */}
      {!filteredClients.length && (
        <Center py="md">
          <Text c="dimmed">No matching clients</Text>
        </Center>
      )}
    </Box>
  );
}
