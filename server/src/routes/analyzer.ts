import { Router } from "express";
import { z } from "zod";
import OpenAI from "openai";
import multer from "multer";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";        
import { prisma } from "../lib/prisma.js";
import { spendCredits } from "../services/credits.js";
import { env } from "../config/env.js";

const upload = multer({ storage: multer.memoryStorage() });

export const analyzerRouter = Router();

analyzerRouter.post("/run", requireAuth, upload.single("resumePdf"), async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }
  
  // Future Implementation: Actually parse the PDF Buffer via external service or Cloudinary upload
  // Right now, we fallback to resumeText if provided, else just dummy string
  const resumeText = req.body.resumeText || (req.file ? "Parsed PDF text mock" : "");
  if (resumeText.length < 10 && !req.file) {
    return res.status(400).json({ message: "Provide either a resume PDF or pasted text (min 10 chars)." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.id },
      select: {
        githubUrl: true, linkedinUrl: true, targetRoles: true,
        strongConcepts: true, gpa: true,
        projects: { select: { title: true, techStack: true } },
        certifications: { select: { name: true } }
      }
    });

    if (!env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const isGemini = env.OPENAI_API_KEY.startsWith("AIza");
    const client = new OpenAI({ 
      apiKey: env.OPENAI_API_KEY,
      ...(isGemini && { baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/" })
    });

    const profileData = {
      resume: resumeText,
      githubUrl: user?.githubUrl,
      linkedinUrl: user?.linkedinUrl,
      projects: user?.projects,
      certifications: user?.certifications,
      targetRoles: user?.targetRoles,
      gpa: user?.gpa,
    };

    const completion = await client.chat.completions.create({
      model: isGemini ? "gemini-2.5-flash" : "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: "You are a career strategist specializing in Indian campus placements. Analyze the user profile and provide: 1) A score (0-100) for each category: DSA, Projects, Skills, Communication, Experience. 2) An estimated salary range for Indian tech companies (e.g. '₹8 - 14 LPA'). 3) Top 3-5 specific gaps to address as an array of strings. Return valid JSON only with keys shape: { profileScore: { projects: number, skills: number, dsa: number, communication: number, experience: number }, salaryRange: string, gaps: string[] }."
        },
        {
          role: "user",
          content: JSON.stringify(profileData),
        }
      ]
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("OpenAI returned an empty response.");
    }

    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned);

    await prisma.resume.upsert({
      where: { userId: auth.id },
      update: { analysisJson: result, salaryEst: result.salaryRange },
      create: {
        userId: auth.id,
        fileUrl: req.file ? "mock-cloudinary-url.pdf" : "inline://resume-text",
        analysisJson: result,
        salaryEst: result.salaryRange,
      },
    });

    return res.json(result);
  } catch (error) {
    console.error("Analyzer Error:", error);
    return res.status(500).json({ message: "Failed to analyze profile." });
  }
});

analyzerRouter.post("/deep-dive", requireAuth, async (req, res) => {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await spendCredits(tx, auth.id, 50, "Deep-dive AI analysis");
    });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Could not run deep dive." });
  }

  return res.json({
    summary: "Deep-dive generated",
    recommendations: ["Improve STAR bullets", "Add measurable outcomes", "Target role-aligned projects"],
  });
});

