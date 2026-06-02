import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, type, price, pickup, dropoff } = body;

    const booking = await prisma.booking.create({
      data: {
        provider,
        type,
        price: parseFloat(price),
        pickup,
        dropoff,
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking failed:", error);
    return NextResponse.json({ error: "Failed to save booking" }, { status: 500 });
  }
}
