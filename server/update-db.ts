import { prisma } from './src/lib/prisma.js'; async function main() { await prisma.question.updateMany({ data: { isPremium: true, creditsToUnlock: 20 } }); console.log('Updated db'); } main();
