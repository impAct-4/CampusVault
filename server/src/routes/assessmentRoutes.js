import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';

const router = Router();

// Get assessment questions from DB (not hardcoded)
router.get('/questions', verifyFirebaseToken, async (req, res) => {
    try {
        let questions = await prisma.assessmentQuestion.findMany({
            orderBy: { createdAt: 'asc' },
        });

        // Seed default questions if none exist yet
        if (questions.length === 0) {
            const defaults = [
                { question: 'What is a variable in programming?', options: ['A storage location', 'A function', 'A loop', 'A module'], correctAnswer: 0, category: 'programming' },
                { question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Tree', 'Graph'], correctAnswer: 1, category: 'dsa' },
                { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], correctAnswer: 2, category: 'dsa' },
                { question: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query List', 'Structured Question List', 'Simple Query Language'], correctAnswer: 0, category: 'database' },
                { question: 'Which sorting algorithm has the best average-case complexity?', options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'], correctAnswer: 1, category: 'dsa' },
                { question: 'What is a REST API?', options: ['A database type', 'An architectural style for web services', 'A programming language', 'A CSS framework'], correctAnswer: 1, category: 'web' },
                { question: 'Which keyword is used to declare a constant in JavaScript?', options: ['var', 'let', 'const', 'static'], correctAnswer: 2, category: 'programming' },
                { question: 'What does OOP stand for?', options: ['Object Oriented Programming', 'Ordered Output Processing', 'Open Object Protocol', 'None'], correctAnswer: 0, category: 'programming' },
            ];
            await prisma.assessmentQuestion.createMany({ data: defaults });
            questions = await prisma.assessmentQuestion.findMany({ orderBy: { createdAt: 'asc' } });
        }

        // Strip correctAnswer before sending to client
        const safeQuestions = questions.map(({ id, question, options, category, difficulty }) => ({
            id, question, options, category, difficulty
        }));

        res.json({ questions: safeQuestions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Failed to fetch assessment questions' });
    }
});

// Grade assessment and update student skill category + skills
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

        // Fetch all questions from DB
        const allQuestions = await prisma.assessmentQuestion.findMany();
        const questionMap = Object.fromEntries(allQuestions.map(q => [q.id, q]));

        let correctCount = 0;
        const categoryScores = {};

        for (const answer of answers) {
            const question = questionMap[answer.questionId];
            if (!question) continue;

            const cat = question.category || 'general';
            if (!categoryScores[cat]) categoryScores[cat] = { correct: 0, total: 0 };
            categoryScores[cat].total++;

            if (question.correctAnswer === answer.selectedOptionIndex) {
                correctCount++;
                categoryScores[cat].correct++;
            }
        }

        const totalQuestions = answers.length;
        const score = Math.round((correctCount / totalQuestions) * 100);

        let skillCategory = 'Beginner';
        if (score >= 80) skillCategory = 'Advanced';
        else if (score >= 60) skillCategory = 'Interview-Ready';

        // Upsert skills based on category performance
        const skillUpserts = Object.entries(categoryScores).map(([cat, { correct, total }]) => {
            const pct = Math.round((correct / total) * 100);
            return prisma.studentSkill.upsert({
                where: { studentId_skillName: { studentId, skillName: cat } },
                create: { studentId, skillName: cat, status: pct >= 60 ? 'having' : 'lacking', level: pct },
                update: { status: pct >= 60 ? 'having' : 'lacking', level: pct },
            });
        });
        await Promise.all(skillUpserts);

        const student = await prisma.student.update({
            where: { id: studentId },
            data: { skillCategory, hasCompletedAssessment: true },
        });

        res.json({
            success: true,
            score,
            skillCategory,
            categoryScores,
            message: `Assessment completed! Your skill level: ${skillCategory}`,
            student: { id: student.id, firstName: student.firstName, lastName: student.lastName, skillCategory: student.skillCategory },
        });
    } catch (error) {
        console.error('Assessment grading error:', error);
        res.status(500).json({ error: 'Failed to grade assessment' });
    }
});

export default router;
