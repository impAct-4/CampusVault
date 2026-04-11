import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { optionalAuth, type AuthedRequest } from "../middleware/auth.js";

export const companiesRouter = Router();

companiesRouter.get("/", async (req, res) => {
  const branch = typeof req.query.branch === "string" ? req.query.branch : undefined;
  const gpa = typeof req.query.gpa === "string" ? Number(req.query.gpa) : undefined;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;

  const companies = await prisma.company.findMany({
    where: {
      ...(branch ? { eligibleBranches: { has: branch } } : {}),
      ...(typeof gpa === "number" && Number.isFinite(gpa)
        ? {
            OR: [{ minGpa: { lte: gpa } }, { minGpa: null }],
          }
        : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });

  return res.json(companies);
});

companiesRouter.get("/:id", optionalAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  const company = await prisma.company.findUnique({
    where: { id: req.params.id as string },
    include: {
      questions: {
        select: {
          id: true,
          content: true,
          round: true,
          year: true,
          isPremium: true,
          creditsToUnlock: true,
          answers: auth ? {
            where: { unlocks: { some: { userId: auth.id } } },
            select: { content: true }
          } : false,
        },
      },
    },
  });

  if (!company) {
    return res.status(404).json({ message: "Company not found." });
  }
  return res.json(company);
});

companiesRouter.get("/:id/questions", async (req, res) => {
  const questions = await prisma.question.findMany({
    where: { companyId: req.params.id },
    orderBy: { year: "desc" },
  });
  return res.json(questions);
});

