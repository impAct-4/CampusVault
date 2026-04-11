import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

export const creditsRouter = Router();

creditsRouter.get("/history", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  const history = await prisma.creditTransaction.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: "desc" },
  });
  return res.json(history);
});

