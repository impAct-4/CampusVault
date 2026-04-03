import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
const router = express.Router();
// GET: Fetch all mentors
router.get('/', async (req, res) => {
    try {
        const mentors = await prisma.mentor.findMany({
            include: {
                mentorshipSessions: {
                    select: {
                        id: true,
                        studentId: true,
                        title: true,
                        rating: true,
                    },
                },
            },
            orderBy: {
                experience: 'desc',
            },
        });
        res.status(200).json({
            success: true,
            data: mentors,
        });
    }
    catch (error) {
        console.error('Error fetching mentors:', error);
        res.status(500).json({ error: 'Failed to fetch mentors' });
    }
});
// GET: Fetch mentor by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mentor = await prisma.mentor.findUnique({
            where: { id },
            include: {
                mentorshipSessions: {
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
        if (!mentor) {
            res.status(404).json({ error: 'Mentor not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: mentor,
        });
    }
    catch (error) {
        console.error('Error fetching mentor:', error);
        res.status(500).json({ error: 'Failed to fetch mentor' });
    }
});
// POST: Create new mentor profile
router.post('/create', verifyFirebaseToken, async (req, res) => {
    try {
        const { firstName, lastName, email, phone, expertise, company, designation, experience, bio, hourlyRate } = req.body;
        if (!firstName || !lastName || !email || !phone || !company || !designation) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const existingMentor = await prisma.mentor.findUnique({
            where: { email },
        });
        if (existingMentor) {
            res.status(409).json({ error: 'Mentor already registered' });
            return;
        }
        const mentor = await prisma.mentor.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                expertise: expertise || [],
                company,
                designation,
                experience: parseInt(experience) || 0,
                bio,
                hourlyRate: hourlyRate ? parseFloat(hourlyRate) : null,
                password: '', // Firebase handles auth in production
            },
        });
        res.status(201).json({
            success: true,
            message: 'Mentor profile created',
            data: mentor,
        });
    }
    catch (error) {
        console.error('Error creating mentor:', error);
        res.status(500).json({ error: 'Failed to create mentor profile' });
    }
});
// PUT: Update mentor profile
router.put('/:id', verifyFirebaseToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { bio, expertise, hourlyRate, isVerified } = req.body;
        const updatedMentor = await prisma.mentor.update({
            where: { id },
            data: {
                ...(bio && { bio }),
                ...(expertise && { expertise }),
                ...(hourlyRate && { hourlyRate: parseFloat(hourlyRate) }),
                ...(isVerified !== undefined && { isVerified }),
            },
        });
        res.status(200).json({
            success: true,
            message: 'Mentor updated successfully',
            data: updatedMentor,
        });
    }
    catch (error) {
        console.error('Error updating mentor:', error);
        res.status(500).json({ error: 'Failed to update mentor' });
    }
});
export default router;
