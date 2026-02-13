"use client";
import {
  ActionIcon,
  AppShell,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  NavLink,
  Paper,
  Popover,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  IoAddCircleOutline,
  IoBriefcaseOutline,
  IoCogOutline,
  IoHammerOutline,
  IoHandLeftOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMenu,
  IoPeopleOutline,
  IoPersonOutline,
} from "react-icons/io5";
import ClientPropertyModal from "../components/ClientModal";
import NewJobModal from "../components/popups/JobModal";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [opened, { toggle }] = useDisclosure(true);
  const [clientPopoverOpened, setClientPopoverOpened] = useState(false);
  const [jobPopoverOpened, setJobPopoverOpened] = useState(false);
  const pathname = usePathname();

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 72,
        breakpoint: "sm",
      }}
    >
      <AppShell.Navbar p="md">
        <Stack h="100%" justify="space-between">
          <Stack gap="xs">
            <Flex justify="center">
              {/* <ActionIcon
                variant="subtle"
                onClick={toggle}
                mb="sm"
                aria-label="Toggle sidebar"
              >
                <IoMenu size={20} />
              </ActionIcon> */}
            </Flex>
            <Flex align="center" justify="center">
              <Popover position="right" withArrow shadow="md">
                <Popover.Target>
                  <ActionIcon
                    variant="filled"
                    mb="sm"
                    aria-label="Toggle sidebar"
                  >
                    <IoAddCircleOutline size={20} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown p="xs">
                  <Flex gap="md">
                    <ActionIcon
                      variant="light"
                      size="xl"
                      onClick={() => setJobPopoverOpened(true)}
                    >
                      <IoHammerOutline />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="orange"
                      size="xl"
                      onClick={() => setClientPopoverOpened(true)}
                    >
                      <IoPersonOutline />
                    </ActionIcon>
                  </Flex>
                </Popover.Dropdown>
              </Popover>
            </Flex>
            <Tooltip label="Dashboard" position="right" withArrow>
              <NavLink
                component={Link}
                href="/"
                bdrs="md"
                leftSection={<IoHomeOutline />}
                active={pathname === "/"}
              />
            </Tooltip>
            <Tooltip label="Clients" position="right" withArrow>
              <NavLink
                component={Link}
                href="/clients"
                bdrs="md"
                leftSection={<IoPeopleOutline />}
                active={pathname.startsWith("/clients")}
              />
            </Tooltip>
            <Tooltip label="Employees" position="right" withArrow>
              <NavLink
                component={Link}
                href="/users"
                bdrs="md"
                leftSection={<IoBriefcaseOutline />}
                active={pathname.startsWith("/users")}
              />
            </Tooltip>
            <Tooltip label="Settings" position="right" withArrow>
              <NavLink
                component={Link}
                href="/settings"
                bdrs="md"
                leftSection={<IoCogOutline />}
                active={pathname.startsWith("/settings")}
              />
            </Tooltip>

            <Box>
              <Divider mb="xs" />
              <NavLink
                component="button"
                leftSection={<IoLogOutOutline size={18} />}
                color="red"
                bdrs="md"
                onClick={() => signOut({ callbackUrl: "/login" })}
              />
            </Box>
          </Stack>
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container fluid>
          <ClientPropertyModal
            opened={clientPopoverOpened}
            onClose={() => setClientPopoverOpened(false)}
          />
          <NewJobModal
            opened={jobPopoverOpened}
            onClose={() => setJobPopoverOpened(false)}
          />
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
