import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/session";
import { NextResponse } from "next/server";

type CreateClientPayload = {
  title?: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  preferredContact: "call" | "sms" | "email";
  leadSource?: string;

  addresses: {
    street1: string;
    street2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isBilling?: boolean;
  }[];

  note?: string;
};

export type Address = {
  street1: string;
  street2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;

  isPrimary?: boolean;
  isBilling?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      firstName,
      lastName,
      companyName,
      email,
      phone,
      preferredContact,
      leadSource,
      addresses,
      note,
    } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!addresses || addresses.length === 0) {
      return NextResponse.json(
        { error: "At least one address is required" },
        { status: 400 },
      );
    }

    const client = await prisma.$transaction(async (tx) => {
      const createdClient = await tx.client.create({
        data: {
          title,
          firstName,
          lastName,
          companyName,
          email,
          phone,
          preferredContact,
          leadSource,
        },
      });

      await tx.address.createMany({
        data: addresses.map((addr: Address, index: number) => ({
          clientId: createdClient.id,
          street1: addr.street1,
          street2: addr.street2,
          city: addr.city,
          province: addr.province,
          postalCode: addr.postalCode,
          country: addr.country,
          isBilling: !!addr.isBilling,
          isPrimary: index === 0,
        })),
      });

      if (note) {
        await tx.clientNote.create({
          data: {
            clientId: createdClient.id,
            content: note,
          },
        });
      }

      return createdClient;
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Create client failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
