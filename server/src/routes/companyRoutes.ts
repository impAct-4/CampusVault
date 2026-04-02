import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyFirebaseToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// GET: Fetch eligible companies for authenticated student
router.get('/eligible', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.uid;

    if (!studentId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Fetch student with their GPA
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { cgpa: true, skillCategory: true },
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    // Fetch companies where student's GPA >= company's minGpa
    const eligibleCompanies = await prisma.company.findMany({
      where: {
        minGpa: {
          lte: student.cgpa, // minGpa <= student.cgpa
        },
      },
      include: {
        placements: {
          select: {
            id: true,
            position: true,
            salary: true,
            ctc: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: eligibleCompanies,
      studentGpa: student.cgpa,
    });
  } catch (error) {
    console.error('Error fetching eligible companies:', error);
    res.status(500).json({ error: 'Failed to fetch eligible companies' });
  }
});

// GET: Fetch company by ID with details
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        placements: {
          select: {
            id: true,
            position: true,
            salary: true,
            salaryType: true,
            salaryMin: true,
            salaryMax: true,
            ctc: true,
            benefits: true,
            location: true,
            deadline: true,
            description: true,
          },
        },
        marketData: {
          orderBy: { year: 'desc' },
          take: 3,
        },
        companyPrepResources: {
          select: {
            id: true,
            title: true,
            resourceType: true,
            fileUrl: true,
          },
        },
      },
    });

    if (!company) {
      res.status(404).json({ error: 'Company not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// GET: Fetch all companies with filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { industry, location, sortBy = 'name' } = req.query;
    const filters: any = {};

    if (industry) {
      filters.industry = {
        contains: industry as string,
        mode: 'insensitive',
      };
    }

    if (location) {
      filters.location = {
        contains: location as string,
        mode: 'insensitive',
      };
    }

    const companies = await prisma.company.findMany({
      where: filters,
      include: {
        placements: {
          select: { id: true, position: true, salary: true },
        },
      },
      orderBy: {
        [sortBy as string]: 'asc',
      },
    });

    res.status(200).json({
      success: true,
      data: companies,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

export default router;