import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const companies = Array.from({ length: 20 }).map((_, idx) => ({
  name: `Company ${idx + 1}`,
  minGpa: 6 + ((idx % 5) * 0.5),
  eligibleBranches: ["CSE", "IT", idx % 2 === 0 ? "ECE" : "AIML"],
  roles: ["SWE", "Data Analyst"],
  requiredSkills: ["DSA", "DBMS", "OS", idx % 2 === 0 ? "React" : "Node.js"],
  package: `${6 + idx} LPA`,
  description: `Campus hiring partner #${idx + 1}`,
}));

async function main() {
  const demoPasswordHash = await bcrypt.hash("Demo12345!", 10);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@placementos.dev" },
    update: {
      name: "Demo Student",
      passwordHash: demoPasswordHash,
      branch: "CSE",
      gpa: 8.1,
      tier: "INTERMEDIATE",
      credits: 250,
      targetRoles: ["SWE", "Frontend Dev"],
      languages: ["JavaScript", "Python", "C++"],
      strongConcepts: ["DSA", "DBMS", "OS"],
    },
    create: {
      email: "demo@placementos.dev",
      name: "Demo Student",
      passwordHash: demoPasswordHash,
      branch: "CSE",
      gpa: 8.1,
      tier: "INTERMEDIATE",
      credits: 250,
      targetRoles: ["SWE", "Frontend Dev"],
      languages: ["JavaScript", "Python", "C++"],
      strongConcepts: ["DSA", "DBMS", "OS"],
    },
  });

  await prisma.creditTransaction.createMany({
    data: [
      { userId: demoUser.id, amount: 100, reason: "Registration welcome bonus" },
      { userId: demoUser.id, amount: 150, reason: "Demo top-up" },
    ],
    skipDuplicates: true,
  });

  const createdCompanies = [];
  for (const company of companies) {
    const existing = await prisma.company.findFirst({ where: { name: company.name } });
    if (existing) {
      createdCompanies.push(existing);
      continue;
    }
    const created = await prisma.company.create({ data: company });
    createdCompanies.push(created);
  }

  const rounds = ["Technical", "HR", "System Design", "Aptitude"];
  for (let i = 0; i < 100; i += 1) {
    const company = createdCompanies[i % createdCompanies.length];
    const content = `Sample interview question ${i + 1} for ${company.name}`;
    const existing = await prisma.question.findFirst({
      where: { companyId: company.id, content },
    });
    if (!existing) {
      await prisma.question.create({
        data: {
          companyId: company.id,
          postedById: demoUser.id,
          content,
          round: rounds[i % rounds.length],
          year: 2021 + (i % 5),
          isPremium: i % 4 === 0,
          creditsToUnlock: i % 4 === 0 ? 20 : 0,
        },
      });
    }
  }

  const mentorEmails = Array.from({ length: 5 }).map((_, idx) => `mentor${idx + 1}@placementos.dev`);
  for (let idx = 0; idx < mentorEmails.length; idx += 1) {
    const email = mentorEmails[idx];
    const hash = await bcrypt.hash(`MentorPass${idx + 1}!`, 10);
    await prisma.user.upsert({
      where: { email },
      update: {
        name: `Mentor ${idx + 1}`,
        passwordHash: hash,
        tier: "PLACEMENT_READY",
        branch: "CSE",
        gpa: 9,
        targetRoles: ["SWE"],
        languages: ["JavaScript", "Python"],
        strongConcepts: ["DSA", "System Design"],
      },
      create: {
        email,
        name: `Mentor ${idx + 1}`,
        passwordHash: hash,
        tier: "PLACEMENT_READY",
        branch: "CSE",
        gpa: 9,
        targetRoles: ["SWE"],
        languages: ["JavaScript", "Python"],
        strongConcepts: ["DSA", "System Design"],
      },
    });
  }

  console.log("Seed complete: demo user, 20 companies, 100 questions, 5 mentors.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

