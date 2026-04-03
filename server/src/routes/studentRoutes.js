import express from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
const router = express.Router();
// GET: Fetch student profile
router.get('/profile', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const student = await prisma.student.findUnique({
            where: { id: studentId },
            include: {
                applications: {
                    include: {
                        placement: {
                            include: {
                                company: true,
                            },
                        },
                    },
                },
                mentorshipSessions: true,
            },
        });
        if (!student) {
            res.status(404).json({ error: 'Student not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: student,
        });
    }
    catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// PUT: Update student profile
router.put('/profile', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        const { firstName, lastName, bio, profileImage, resumeUrl, skillCategory } = req.body;
        if (!studentId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const updatedStudent = await prisma.student.update({
            where: { id: studentId },
            data: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(bio && { bio }),
                ...(profileImage && { profileImage }),
                ...(resumeUrl && { resumeUrl }),
                ...(skillCategory && { skillCategory }),
            },
        });
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedStudent,
        });
    }
    catch (error) {
        console.error('Error updating student profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// POST: Create student profile (Firebase integration)
router.post('/create', verifyFirebaseToken, async (req, res) => {
    try {
        const studentId = req.user?.uid;
        const { firstName, lastName, email, phone, college, branch, cgpa } = req.body;
        if (!studentId || !firstName || !lastName || !email || !phone || !college || !branch || cgpa === undefined) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const existingById = await prisma.student.findUnique({
            where: { id: studentId },
        });

        if (!existingById) {
            const existingByEmail = await prisma.student.findUnique({
                where: { email },
            });
            if (existingByEmail && existingByEmail.id !== studentId) {
                res.status(409).json({ error: 'Email is already used by another account' });
                return;
            }

            const existingByPhone = await prisma.student.findUnique({
                where: { phone },
            });
            if (existingByPhone && existingByPhone.id !== studentId) {
                res.status(409).json({ error: 'Phone number is already used by another account' });
                return;
            }
        }

        const student = await prisma.student.upsert({
            where: { id: studentId },
            create: {
                id: studentId,
                firstName,
                lastName,
                email,
                phone,
                college,
                branch,
                cgpa: parseFloat(cgpa),
                password: '',
            },
            update: {
                firstName,
                lastName,
                email,
                phone,
                college,
                branch,
                cgpa: parseFloat(cgpa),
            },
        });

        res.status(201).json({
            success: true,
            message: existingById ? 'Student profile updated' : 'Student profile created',
            data: student,
        });
    }
    catch (error) {
        console.error('Error creating student profile:', error);
        res.status(500).json({ error: 'Failed to create profile' });
    }
});
// GET: Fetch all students (Admin)
router.get('/all', async (req, res) => {
    try {
        const students = await prisma.student.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                college: true,
                branch: true,
                cgpa: true,
            },
        });
        res.status(200).json({
            success: true,
            data: students,
        });
    }
    catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});
export default router;
