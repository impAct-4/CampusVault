import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';
const router = Router();
// Mock assessment questions and answers
const assessmentQuestions = [
    {
        id: 1,
        question: 'What is a variable in programming?',
        options: ['A storage location', 'A function', 'A loop', 'A module'],
        correctAnswer: 0,
    },
    {
        id: 2,
        question: 'Which data structure uses LIFO?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
    },
    {
        id: 3,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correctAnswer: 2,
    },
    {
        id: 4,
        question: 'What does SQL stand for?',
        options: ['Structured Query Language', 'Simple Query List', 'Structured Question List', 'Simple Query Language'],
        correctAnswer: 0,
    },
    {
        id: 5,
        question: 'Which sorting algorithm has the best average-case complexity?',
        options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
        correctAnswer: 1,
    },
];
// Get assessment questions
router.get('/questions', verifyFirebaseToken, (req, res) => {
    try {
        const questions = assessmentQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            options: q.options,
        }));
        res.json({ questions });
    }
    catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch assessment questions' });
    }
});
// Grade assessment and update student skill category
router.post('/submit', verifyFirebaseToken, async (req, res) => {
    try {
        const { answers } = req.body;
        const studentId = req.user?.uid;
        if (!studentId) {
            res.status(401).json({ error: 'User ID not found in token' });
            return;
        }
        if (!answers || !Array.isArray(answers)) {
            res.status(400).json({ error: 'Invalid answers format' });
            return;
        }
        // Grade the assessment
        let correctCount = 0;
        for (const answer of answers) {
            const question = assessmentQuestions.find((q) => q.id === answer.questionId);
            if (question && question.correctAnswer === answer.selectedOptionIndex) {
                correctCount++;
            }
        }
        const totalQuestions = assessmentQuestions.length;
        const score = Math.round((correctCount / totalQuestions) * 100);
        // Determine skill category based on score
        let skillCategory = 'Beginner';
        if (score >= 80) {
            skillCategory = 'Advanced';
        }
        else if (score >= 60) {
            skillCategory = 'Interview-Ready';
        }
        // Update student with skill category and assessment completion status
        const student = await prisma.student.update({
            where: { id: studentId },
            data: {
                skillCategory,
                hasCompletedAssessment: true,
            },
        });
        res.json({
            success: true,
            score,
            skillCategory,
            message: `Assessment completed! Your skill level: ${skillCategory}`,
            student: {
                id: student.id,
                firstName: student.firstName,
                lastName: student.lastName,
                skillCategory: student.skillCategory,
            },
        });
    }
    catch (error) {
        console.error('Assessment grading error:', error);
        res.status(500).json({ error: 'Failed to grade assessment' });
    }
});
export default router;
