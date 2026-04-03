import prisma from '../src/lib/prisma.js';

async function main() {
  console.log('🌱 Seeding database...\n');

  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.$transaction([
      prisma.questionPurchase.deleteMany(),
      prisma.question.deleteMany(),
      prisma.companyPrepSession.deleteMany(),
      prisma.companyPrepResource.deleteMany(),
      prisma.marketData.deleteMany(),
      prisma.marketAnalytics.deleteMany(),
      prisma.placementApplication.deleteMany(),
      prisma.placement.deleteMany(),
      prisma.mentorshipSession.deleteMany(),
      prisma.company.deleteMany(),
      prisma.mentor.deleteMany(),
      prisma.student.deleteMany(),
    ]);

    // Create Students
    console.log('\n📚 Creating students...');
    const student1 = await prisma.student.create({
      data: {
        firstName: 'Raj',
        lastName: 'Kumar',
        email: 'raj@campusvault.com',
        phone: '9876543210',
        password: 'hashed_password_1',
        college: 'IIT Delhi',
        branch: 'CSE',
        cgpa: 8.5,
        creditBalance: 150,
        skillCategory: 'Interview-Ready',
      },
    });

    const student2 = await prisma.student.create({
      data: {
        firstName: 'Priya',
        lastName: 'Singh',
        email: 'priya@campusvault.com',
        phone: '9876543211',
        password: 'hashed_password_2',
        college: 'NIT Bangalore',
        branch: 'CSE',
        cgpa: 7.8,
        creditBalance: 100,
        skillCategory: 'Beginner',
      },
    });

    const student3 = await prisma.student.create({
      data: {
        firstName: 'Arjun',
        lastName: 'Patel',
        email: 'arjun@campusvault.com',
        phone: '9876543212',
        password: 'hashed_password_3',
        college: 'BITS Pilani',
        branch: 'ECE',
        cgpa: 8.2,
        creditBalance: 200,
        skillCategory: 'Interview-Ready',
      },
    });
    console.log('✓ Created 3 students');

    // Create Mentors
    console.log('\n👨‍🏫 Creating mentors...');
    const mentor1 = await prisma.mentor.create({
      data: {
        firstName: 'Rohit',
        lastName: 'Verma',
        email: 'rohit.mentor@company.com',
        phone: '9988776655',
        password: 'hashed_mentor_1',
        expertise: ['DSA', 'System Design', 'Backend'],
        company: 'Google',
        designation: 'Senior Software Engineer',
        experience: 6,
        bio: 'Ex-Google with 6 years of experience in backend systems',
        hourlyRate: 1500,
        isVerified: true,
      },
    });

    const mentor2 = await prisma.mentor.create({
      data: {
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha.mentor@company.com',
        phone: '9988776656',
        password: 'hashed_mentor_2',
        expertise: ['Frontend', 'React', 'Web Design'],
        company: 'Microsoft',
        designation: 'Software Engineer II',
        experience: 4,
        bio: 'Microsoft frontend specialist with focus on React',
        hourlyRate: 1200,
        isVerified: true,
      },
    });
    console.log('✓ Created 2 mentors');

    // Create Companies
    console.log('\n🏢 Creating companies...');
    const company1 = await prisma.company.create({
      data: {
        name: 'Google India',
        website: 'https://www.google.com',
        description: 'Leading tech company with focus on AI and cloud services',
        industry: 'Technology',
        location: 'Bangalore',
        minGpa: 7.5,
        recruiters: ['Rajesh Kumar', 'Priya Mishra'],
      },
    });

    const company2 = await prisma.company.create({
      data: {
        name: 'Microsoft India',
        website: 'https://www.microsoft.com',
        description: 'Software development and cloud solutions',
        industry: 'Technology',
        location: 'Hyderabad',
        minGpa: 7.0,
        recruiters: ['Amit Singh'],
      },
    });

    const company3 = await prisma.company.create({
      data: {
        name: 'Amazon India',
        website: 'https://www.amazon.com',
        description: 'E-commerce and AWS cloud platform',
        industry: 'E-commerce',
        location: 'Bangalore',
        minGpa: 6.5,
        recruiters: ['Suresh Kumar'],
      },
    });

    const company4 = await prisma.company.create({
      data: {
        name: 'Goldman Sachs',
        website: 'https://www.goldmansachs.com',
        description: 'Investment banking and financial services',
        industry: 'Finance',
        location: 'Mumbai',
        minGpa: 8.0,
        recruiters: ['Rahul Desai'],
      },
    });

    const company5 = await prisma.company.create({
      data: {
        name: 'McKinsey India',
        website: 'https://www.mckinsey.com',
        description: 'Global management consulting',
        industry: 'Consulting',
        location: 'Delhi',
        minGpa: 8.5,
        recruiters: ['Vikram Joshi'],
      },
    });
    console.log('✓ Created 5 companies');

    // Create Placements
    console.log('\n💼 Creating placements...');
    const placement1 = await prisma.placement.create({
      data: {
        companyId: company1.id,
        position: 'Software Engineer - Backend',
        salary: 1200000,
        salaryType: 'Annual',
        salaryMin: 1000000,
        salaryMax: 1500000,
        ctc: 1500000,
        benefits: ['Health Insurance', 'Free Lunch', 'Stock Options'],
        location: 'Bangalore',
        eligibility: 'B.Tech CSE with 7.5+ CGPA',
        description: 'Build scalable backend systems serving millions of users',
        deadline: new Date('2026-06-30'),
      },
    });

    const placement2 = await prisma.placement.create({
      data: {
        companyId: company2.id,
        position: 'Software Engineer',
        salary: 1300000,
        salaryType: 'Annual',
        salaryMin: 1100000,
        salaryMax: 1600000,
        ctc: 1600000,
        benefits: ['Health Insurance', 'Home Loan Assistance', 'Relocation'],
        location: 'Hyderabad',
        eligibility: 'B.Tech CSE/IT with 7.0+ CGPA',
        description: 'Work on Azure cloud platform and enterprise software',
        deadline: new Date('2026-07-15'),
      },
    });

    const placement3 = await prisma.placement.create({
      data: {
        companyId: company3.id,
        position: 'Software Development Engineer',
        salary: 1400000,
        salaryType: 'Annual',
        salaryMin: 1200000,
        salaryMax: 1700000,
        ctc: 1700000,
        benefits: ['Health Insurance', 'Free Food', 'Stock Options', 'Remote Work'],
        location: 'Bangalore',
        eligibility: 'B.Tech any branch with 6.5+ CGPA',
        description: 'Build e-commerce and AWS services',
        deadline: new Date('2026-08-10'),
      },
    });

    const placement4 = await prisma.placement.create({
      data: {
        companyId: company4.id,
        position: 'Analyst',
        salary: 1800000,
        salaryType: 'Annual',
        salaryMin: 1500000,
        salaryMax: 2000000,
        ctc: 2200000,
        benefits: ['Sign-on Bonus', 'Relocation', 'Housing Allowance'],
        location: 'Mumbai',
        eligibility: 'B.Tech/MBA with 8.0+ CGPA',
        description: 'Quantitative analysis and trading systems',
        deadline: new Date('2026-05-30'),
      },
    });

    const placement5 = await prisma.placement.create({
      data: {
        companyId: company5.id,
        position: 'Business Analyst',
        salary: 1100000,
        salaryType: 'Annual',
        salaryMin: 900000,
        salaryMax: 1300000,
        ctc: 1400000,
        benefits: ['Professional Development', 'Flexible Hours'],
        location: 'Delhi',
        eligibility: 'B.Tech any branch with 7.8+ CGPA',
        description: 'Provide data-driven consulting and business solutions',
        deadline: new Date('2026-09-15'),
      },
    });
    console.log('✓ Created 5 placements');

    // Create Market Data
    console.log('\n📊 Creating market data...');
    await prisma.marketData.create({
      data: {
        companyId: company1.id,
        averageSalary: 1350000,
        packageRange: '10-15 LPA',
        placements: 45,
        year: 2025,
        branch: 'CSE',
      },
    });

    await prisma.marketData.create({
      data: {
        companyId: company2.id,
        averageSalary: 1450000,
        packageRange: '12-16 LPA',
        placements: 35,
        year: 2025,
        branch: 'CSE',
      },
    });
    console.log('✓ Created market data');

    // Create Questions
    console.log('\n❓ Creating forum questions...');
    const q1 = await prisma.question.create({
      data: {
        authorId: student1.id,
        title: 'How to optimize binary tree traversal?',
        company: 'Google',
        text: 'I am getting TLE on my DFS solution for a tree problem. How can I optimize it?',
        isPaid: false,
        cost: 0,
      },
    });

    const q2 = await prisma.question.create({
      data: {
        authorId: student2.id,
        title: 'Best practices for microservices architecture',
        company: 'Microsoft',
        text: 'What are the key considerations when designing a microservices-based system?',
        isPaid: true,
        cost: 200,
      },
    });

    const q3 = await prisma.question.create({
      data: {
        authorId: student3.id,
        title: 'Database optimization tips for large datasets',
        company: 'Amazon',
        text: 'How to handle indexing and query optimization for millions of records?',
        isPaid: false,
        cost: 0,
      },
    });

    const q4 = await prisma.question.create({
      data: {
        authorId: student1.id,
        title: 'Interview experience at top tech companies',
        company: 'Google',
        text: 'Share your interview journey and what helped you crack it.',
        isPaid: true,
        cost: 150,
      },
    });
    console.log('✓ Created 4 forum questions');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Created:');
    console.log('   - 3 students');
    console.log('   - 2 mentors');
    console.log('   - 5 companies');
    console.log('   - 5 placements');
    console.log('   - 4 forum questions');
    console.log('   - Market data for companies\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
