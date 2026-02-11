"use client";
import { useState } from "react";
import {
  Modal,
  TextInput,
  Select,
  Checkbox,
  Button,
  Grid,
  Stack,
  Group,
  Title,
  Text,
  Accordion,
  Paper,
  Divider,
  Textarea,
  Radio,
} from "@mantine/core";
import { useForm } from "@mantine/form";

type Props = {
  opened: boolean;
  onClose: () => void;
};

type Address = {
  street1: string;
  street2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

export default function ClientPropertyModal({ opened, onClose }: Props) {
  const form = useForm({
    initialValues: {
      title: "No title",
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      email: "",
      preferredContact: "email",
      leadSource: "",
      note: "",

      addresses: [
        {
          street1: "",
          street2: "",
          city: "",
          province: "",
          postalCode: "",
          country: "Canada",
          billingSameAsProperty: true,
        },
      ],
    },

    validate: {
      firstName: (v) => (!v ? "First name is required" : null),
      lastName: (v) => (!v ? "Last name is required" : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : "Invalid email address"),
      phone: (v) => (v.length < 10 ? "Invalid phone number" : null),

      addresses: {
        street1: (v) => (!v ? "Street address is required" : null),
        city: (v) => (!v ? "City is required" : null),
        province: (v) => (!v ? "Province is required" : null),
        postalCode: (v) => (!v ? "Postal code is required" : null),
      },
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      form.clearErrors();

      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // ✅ success
      form.reset();
      onClose?.();
    } catch (error) {
      console.log(error);
      // form.setErrors({
      //   email: error.message, // example mapping
      // });
    }
  };

  const emptyAddress: Address = {
    street1: "",
    street2: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  };

  const [addresses, setAddresses] = useState<Address[]>([emptyAddress]);

  const addAddress = () => {
    setAddresses((prev) => [...prev, emptyAddress]);
  };

  const updateAddress = (
    index: number,
    field: keyof Address,
    value: string,
  ) => {
    setAddresses((prev) =>
      prev.map((addr, i) => (i === index ? { ...addr, [field]: value } : addr)),
    );
  };

  const removeAddress = (index: number) => {
    setAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add client"
      size="xl"
      radius="lg"
    >
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Stack gap="xl">
          <Grid>
            <Grid.Col span={4}>
              <Title order={5}>Primary contact details</Title>
              <Text size="sm" c="dimmed">
                Provide the main point of contact to ensure smooth communication
                and reliable client records.
              </Text>
            </Grid.Col>

            <Grid.Col span={8}>
              <Stack gap="md">
                {/* Name row */}
                <Grid>
                  <Grid.Col span={3}>
                    <Select
                      label="Title"
                      data={["No title", "Mr.", "Mrs.", "Ms.", "Dr."]}
                      {...form.getInputProps("title")}
                    />
                  </Grid.Col>

                  <Grid.Col span={4.5}>
                    <TextInput
                      label="First name"
                      withAsterisk
                      {...form.getInputProps("firstName")}
                    />
                  </Grid.Col>

                  <Grid.Col span={4.5}>
                    <TextInput
                      label="Last name"
                      withAsterisk
                      {...form.getInputProps("lastName")}
                    />
                  </Grid.Col>
                </Grid>
                <TextInput
                  label="Company name"
                  {...form.getInputProps("company")}
                />
                <Title order={6}>Communication</Title>
                <TextInput
                  label="Phone number"
                  {...form.getInputProps("phone")}
                />
                <TextInput
                  label="Email"
                  withAsterisk
                  {...form.getInputProps("email")}
                />
                <Radio.Group
                  label="Preferred communication method"
                  {...form.getInputProps("preferredContact")}
                >
                  <Group>
                    <Radio value="call" label="Call" />
                    <Radio value="sms" label="SMS" />
                    <Radio value="email" label="Email" />
                  </Group>
                </Radio.Group>

                <Title order={6}>Lead information</Title>
                <TextInput
                  label="Lead source"
                  {...form.getInputProps("leadSource")}
                />
              </Stack>
            </Grid.Col>
          </Grid>
          <Divider />
          <Grid>
            <Grid.Col span={4}>
              <Title order={5}>Property address</Title>
              <Text size="sm" c="dimmed">
                Enter the primary service address, billing address, or any
                additional locations where services may take place.
              </Text>

              <Button mt="sm" variant="light">
                Add another address
              </Button>
            </Grid.Col>
            <Grid.Col span={8}>
              <Stack gap="md">
                {form.values.addresses.map((_, index) => (
                  <Paper key={index} withBorder p="md" radius="md">
                    <Stack>
                      <Group justify="space-between">
                        <strong>Address {index + 1}</strong>

                        {form.values.addresses.length > 1 && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color="red"
                            onClick={() =>
                              form.removeListItem("addresses", index)
                            }
                          >
                            Remove
                          </Button>
                        )}
                      </Group>

                      <TextInput
                        label="Street 1"
                        {...form.getInputProps(`addresses.${index}.street1`)}
                      />

                      <TextInput
                        label="Street 2"
                        {...form.getInputProps(`addresses.${index}.street2`)}
                      />

                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label="City"
                            {...form.getInputProps(`addresses.${index}.city`)}
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <TextInput
                            label="Province"
                            {...form.getInputProps(
                              `addresses.${index}.province`,
                            )}
                          />
                        </Grid.Col>
                      </Grid>

                      <Grid>
                        <Grid.Col span={6}>
                          <TextInput
                            label="Postal code"
                            {...form.getInputProps(
                              `addresses.${index}.postalCode`,
                            )}
                          />
                        </Grid.Col>

                        <Grid.Col span={6}>
                          <Select
                            label="Country"
                            data={["Canada", "United States"]}
                            {...form.getInputProps(
                              `addresses.${index}.country`,
                            )}
                          />
                        </Grid.Col>
                      </Grid>

                      <Checkbox
                        label="Billing address is the same as property address"
                        {...form.getInputProps(
                          `addresses.${index}.billingSameAsProperty`,
                          { type: "checkbox" },
                        )}
                      />
                    </Stack>
                  </Paper>
                ))}

                <Button
                  variant="light"
                  onClick={() =>
                    form.insertListItem("addresses", {
                      street1: "",
                      street2: "",
                      city: "",
                      province: "",
                      postalCode: "",
                      country: "Canada",
                      billingSameAsProperty: true,
                    })
                  }
                >
                  Add another address
                </Button>
              </Stack>
            </Grid.Col>
          </Grid>

          <Accordion variant="contained">
            <Accordion.Item value="note">
              <Accordion.Control>Add note</Accordion.Control>

              <Accordion.Panel>
                <Stack>
                  <Text size="sm" c="dimmed">
                    Add internal notes about this property or client. Notes are
                    visible to your team only.
                  </Text>

                  <Textarea
                    placeholder="Type your note here..."
                    minRows={4}
                    autosize
                    {...form.getInputProps("note")}
                  />

                  <Group justify="flex-end">
                    <Button variant="default" size="sm">
                      Cancel
                    </Button>
                    <Button size="sm">Save note</Button>
                  </Group>
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
