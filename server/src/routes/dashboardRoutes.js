import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
const router = express.Router();
// GET: Student dashboard analytics
router.get('/analytics', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Get applications count
        const applicationCount = await prisma.placementApplication.count({
            where: { studentId },
        });
        // Get mentorship sessions count
        const sessionCount = await prisma.mentorshipSession.count({
            where: { studentId },
        });
        // Get student info
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: {
                firstName: true,
                lastName: true,
                cgpa: true,
                branch: true,
                creditBalance: true,
                hasCompletedAssessment: true,
            },
        });
        res.status(200).json({
            success: true,
            data: {
                student,
                statistics: {
                    applicationsCount: applicationCount,
                    sessionsCount: sessionCount,
                    recentProgress: 'In Progress',
                },
            },
        });
    }
    catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});
// GET: Market trends and recommendations
router.get('/recommendations', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { cgpa: true, branch: true },
        });
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        // Get eligible companies
        const eligibleCompanies = await prisma.company.findMany({
            where: {
                minGpa: {
                    lte: student.cgpa,
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
                    take: 3,
                },
            },
            take: 5,
        });
        // Get market trends
        const marketTrends = await prisma.marketData.findMany({
            orderBy: {
                year: 'desc',
            },
            take: 10,
        });
        res.status(200).json({
            success: true,
            data: {
                eligibleCompanies,
                marketTrends,
                studentBranch: student.branch,
            },
        });
    }
    catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});
// GET: Student placement statistics
router.get('/statistics', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const applications = await prisma.placementApplication.findMany({
            where: { studentId },
        });
        const statusCount = {
            applied: 0,
            selected: 0,
            rejected: 0,
            pending: 0,
        };
        applications.forEach((app) => {
            if (app.status === 'applied')
                statusCount.applied++;
            else if (app.status === 'selected')
                statusCount.selected++;
            else if (app.status === 'rejected')
                statusCount.rejected++;
            else
                statusCount.pending++;
        });
        res.status(200).json({
            success: true,
            data: {
                totalApplications: applications.length,
                statusBreakdown: statusCount,
            },
        });
    }
    catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});
export default router;
