import { Prisma, PrismaClient } from "@prisma/client";

// FUTURE IMPLEMENTATION: Redis Implementation
// Per the architecture prompt, these transactions should be queued in Redis 
// for performance before hitting PostgreSQL. Currently, they execute synchronously against PostgreSQL.

export async function addCredits(
  prisma: PrismaClient | Prisma.TransactionClient,
  userId: string,
  amount: number,
  reason: string,
) {
  if (amount <= 0) {
    throw new Error("Credit amount to add must be positive.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { increment: amount } },
  });

  await prisma.creditTransaction.create({
    data: { userId, amount, reason },
  });
}

export async function spendCredits(
  prisma: PrismaClient | Prisma.TransactionClient,
  userId: string,
  amount: number,
  reason: string,
) {
  if (amount <= 0) {
    throw new Error("Credit amount to spend must be positive.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.credits < amount) {
    throw new Error("Insufficient credits.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: amount } },
  });

  await prisma.creditTransaction.create({
    data: { userId, amount: -amount, reason },
  });
}

