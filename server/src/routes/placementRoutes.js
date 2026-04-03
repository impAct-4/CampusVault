import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
const router = express.Router();
// GET: Fetch all placements
router.get('/', async (req, res) => {
    try {
        const placements = await prisma.placement.findMany({
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
            orderBy: {
                salary: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            data: placements,
        });
    }
    catch (error) {
        console.error('Error fetching placements:', error);
        res.status(500).json({ error: 'Failed to fetch placements' });
    }
});
// GET: Fetch placement by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const placement = await prisma.placement.findUnique({
            where: { id },
            include: {
                company: true,
                applications: {
                    include: {
                        student: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!placement) {
            res.status(404).json({ error: 'Placement not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: placement,
        });
    }
    catch (error) {
        console.error('Error fetching placement:', error);
        res.status(500).json({ error: 'Failed to fetch placement' });
    }
});
// POST: Apply for placement
router.post('/apply/:placementId', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        const { placementId } = req.params;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        // Check if student already applied
        const existingApplication = await prisma.placementApplication.findFirst({
            where: {
                studentId,
                placementId,
            },
        });
        if (existingApplication) {
            res.status(409).json({ error: 'Already applied for this placement' });
            return;
        }
        const application = await prisma.placementApplication.create({
            data: {
                studentId,
                placementId,
                status: 'applied',
            },
        });
        res.status(201).json({
            success: true,
            message: 'Applied successfully',
            data: application,
        });
    }
    catch (error) {
        console.error('Error applying for placement:', error);
        res.status(500).json({ error: 'Failed to apply' });
    }
});
// PUT: Update application status
router.put('/application/:applicationId/status', verifyFirebaseToken, async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ error: 'Status is required' });
            return;
        }
        const updatedApplication = await prisma.placementApplication.update({
            where: { id: applicationId },
            data: { status },
        });
        res.status(200).json({
            success: true,
            message: 'Application status updated',
            data: updatedApplication,
        });
    }
    catch (error) {
        console.error('Error updating application:', error);
        res.status(500).json({ error: 'Failed to update application status' });
    }
});
// GET: Student's applications
router.get('/student/applications', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const applications = await prisma.placementApplication.findMany({
            where: { studentId },
            include: {
                placement: {
                    include: {
                        company: true,
                    },
                },
            },
            orderBy: {
                appliedAt: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            data: applications,
        });
    }
    catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});
export default router;
