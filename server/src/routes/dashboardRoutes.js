import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

// GET: Student dashboard analytics (real data, no hardcoded strings)
router.get('/analytics', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const [applicationCount, sessionCount, student, skills, enrollments] = await Promise.all([
            prisma.placementApplication.count({ where: { studentId } }),
            prisma.mentorshipSession.count({ where: { studentId } }),
            prisma.student.findUnique({
                where: { id: studentId },
                select: {
                    firstName: true,
                    lastName: true,
                    cgpa: true,
                    branch: true,
                    college: true,
                    creditBalance: true,
                    hasCompletedAssessment: true,
                    skillCategory: true,
                    targetCompany: true,
                    createdAt: true,
                },
            }),
            prisma.studentSkill.findMany({ where: { studentId } }),
            prisma.enrollment.findMany({
                where: { studentId },
                include: { course: { select: { title: true, category: true, difficulty: true } } },
            }),
        ]);

        if (!student) return res.status(404).json({ error: 'Student not found' });

        res.status(200).json({
            success: true,
            data: {
                student,
                statistics: {
                    applicationsCount: applicationCount,
                    sessionsCount: sessionCount,
                    assessmentCompleted: student.hasCompletedAssessment,
                    skillCategory: student.skillCategory,
                },
                skills,
                enrollments,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// GET: Daily activity streak (last 365 days)
router.get('/streak', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const activities = await prisma.dailyActivity.findMany({
            where: {
                studentId,
                date: { gte: oneYearAgo },
            },
            orderBy: { date: 'asc' },
        });

        // Calculate current streak
        let currentStreak = 0;
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        const activityDates = new Set(activities.map(a => new Date(a.date).toDateString()));

        let checkDate = new Date(today);
        while (activityDates.has(checkDate.toDateString())) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }

        res.status(200).json({
            success: true,
            data: {
                activities: activities.map(a => ({
                    date: a.date,
                    count: a.count,
                })),
                currentStreak,
                totalActiveDays: activities.length,
            },
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({ error: 'Failed to fetch streak data' });
    }
});

// POST: Log today's activity (call on dashboard load)
router.post('/streak/ping', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        await prisma.dailyActivity.upsert({
            where: { studentId_date: { studentId, date: today } },
            create: { studentId, date: today, count: 1 },
            update: { count: { increment: 1 } },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error pinging streak:', error);
        res.status(500).json({ error: 'Failed to log activity' });
    }
});

// GET: Market recommendations based on CGPA
router.get('/recommendations', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const student = await prisma.student.findUnique({
            where: { id: studentId },
            select: { cgpa: true, branch: true, targetCompany: true },
        });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const [eligibleCompanies, marketTrends] = await Promise.all([
            prisma.company.findMany({
                where: { minGpa: { lte: student.cgpa } },
                include: {
                    placements: {
                        select: { id: true, position: true, salary: true, ctc: true },
                        take: 3,
                    },
                },
                take: 5,
            }),
            prisma.marketData.findMany({
                orderBy: { year: 'desc' },
                take: 10,
            }),
        ]);

        res.status(200).json({
            success: true,
            data: { eligibleCompanies, marketTrends, studentBranch: student.branch, targetCompany: student.targetCompany },
        });
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// GET: Student placement statistics 
router.get('/statistics', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

        const applications = await prisma.placementApplication.findMany({
            where: { studentId },
            include: { placement: { include: { company: { select: { name: true } } } } },
        });

        const statusCount = { applied: 0, selected: 0, rejected: 0, pending: 0 };
        applications.forEach(app => {
            const s = app.status;
            if (statusCount[s] !== undefined) statusCount[s]++;
            else statusCount.pending++;
        });

        res.status(200).json({
            success: true,
            data: {
                totalApplications: applications.length,
                statusBreakdown: statusCount,
                recentApplications: applications.slice(0, 5).map(a => ({
                    company: a.placement?.company?.name,
                    position: a.placement?.position,
                    status: a.status,
                    appliedAt: a.appliedAt,
                })),
            },
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

export default router;
