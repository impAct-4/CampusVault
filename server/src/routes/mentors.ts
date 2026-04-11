import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const mentorsRouter = Router();

mentorsRouter.get("/", async (_req, res) => {
  const mentors = await prisma.user.findMany({
    where: { tier: "PLACEMENT_READY" },
    select: { id: true, name: true, email: true, branch: true, targetRoles: true },
    take: 20,
  });
  return res.json(mentors);
});

mentorsRouter.get("/:id/slots", (_req, res) => {
  const now = Date.now();
  const slots = [1, 2, 3, 4].map((offset) => ({
    startsAt: new Date(now + offset * 86_400_000).toISOString(),
    durationMin: 30,
  }));
  return res.json(slots);
});

