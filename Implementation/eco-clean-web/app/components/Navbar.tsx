"use client";

import {
  ActionIcon,
  Affix,
  Box,
  Divider,
  Drawer,
  NavLink,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoCogOutline,
  IoHomeOutline,
  IoLogOutOutline,
  IoMenu,
  IoPeopleOutline,
} from "react-icons/io5";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const pathname = usePathname();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Affix position={{ top: 20, left: 20 }}>
      <Drawer
        size="15%"
        opened={opened}
        onClose={close}
        title="Nettoyage Eco Vert"
      >
        <Stack h="100%" justify="space-between">
          {/* Top navigation */}
          <Stack gap={4}>
            <NavLink
              component={Link}
              href="/"
              bdrs="md"
              label="Dashboard"
              leftSection={<IoHomeOutline size={18} />}
              active={pathname === "/"}
            />

            <NavLink
              component={Link}
              href="/users"
              bdrs="md"
              label="Users"
              leftSection={<IoPeopleOutline size={18} />}
              active={pathname.startsWith("/users")}
            />

            <NavLink
              component={Link}
              href="/settings"
              bdrs="md"
              label="Settings"
              leftSection={<IoCogOutline size={18} />}
              active={pathname.startsWith("/settings")}
            />
          </Stack>

          {/* Bottom logout */}
          <Box>
            <Divider mb="xs" />
            <NavLink
              component="button"
              label="Log out"
              leftSection={<IoLogOutOutline size={18} />}
              color="red"
              bdrs="md"
              onClick={() => {
                signOut({ callbackUrl: "/login" });
              }}
            />
          </Box>
        </Stack>
      </Drawer>

      <ActionIcon variant="default" size="xl" onClick={open}>
        <IoMenu />
      </ActionIcon>
    </Affix>
  );
};

export default Navbar;
