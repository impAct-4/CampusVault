import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { prisma } from "../lib/prisma.js";

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  gpa: z.number().min(0).max(10).optional(),
  course: z.string().optional(),
  branch: z.string().optional(),
  year: z.number().int().min(1).max(5).optional(),
  college: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  leetcodeUrl: z.string().url().optional(),
  targetRoles: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  strongConcepts: z.array(z.string()).optional(),
});

export const usersRouter = Router();
const upload = multer();

usersRouter.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const auth = (req as AuthedRequest).auth;
  if (!auth || auth.id !== id) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatarUrl: true,
      credits: true,
      tier: true,
      gpa: true,
      course: true,
      branch: true,
      year: true,
      college: true,
      linkedinUrl: true,
      githubUrl: true,
      leetcodeUrl: true,
      targetRoles: true,
      languages: true,
      strongConcepts: true,
      projects: true,
      certifications: true,
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  return res.json(user);
});

usersRouter.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const auth = (req as AuthedRequest).auth;
  if (!auth || auth.id !== id) {
    return res.status(403).json({ message: "Forbidden." });
  }

  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid update payload." });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatarUrl: true,
      credits: true,
      tier: true,
      gpa: true,
      course: true,
      branch: true,
      year: true,
      college: true,
      linkedinUrl: true,
      githubUrl: true,
      leetcodeUrl: true,
      targetRoles: true,
      languages: true,
      strongConcepts: true,
    },
  });

  return res.json(updated);
});

usersRouter.post("/:id/avatar", requireAuth, upload.none(), async (req, res) => {
  const { id } = req.params;
  const auth = (req as AuthedRequest).auth;
  if (!auth || auth.id !== id) {
    return res.status(403).json({ message: "Forbidden." });
  }
  const avatarUrl = typeof req.body?.avatarUrl === "string" ? req.body.avatarUrl : "";
  if (!avatarUrl) {
    return res.status(400).json({ message: "avatarUrl is required for now." });
  }
  const updated = await prisma.user.update({
    where: { id },
    data: { avatarUrl },
    select: { id: true, avatarUrl: true },
  });
  return res.json(updated);
});

