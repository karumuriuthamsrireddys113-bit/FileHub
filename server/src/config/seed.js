import bcrypt from 'bcryptjs';

/**
 * Seeds a default demo user and assigns sample documents to that user,
 * ensuring sample documents are never shared or leaked across accounts.
 */
export async function seedSampleDocuments(prisma) {
  try {
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@filehub.com' }
    });

    if (!demoUser) {
      console.log('🌱 Creating default demo account: demo@filehub.com (Password: Password123!)...');
      const hashedPassword = await bcrypt.hash('Password123!', 12);
      demoUser = await prisma.user.create({
        data: {
          name: 'Demo Account',
          email: 'demo@filehub.com',
          password: hashedPassword
        }
      });
    }

    // Associate any existing orphaned documents with the demo user
    await prisma.document.updateMany({
      where: { userId: null },
      data: { userId: demoUser.id }
    });

    const existingDocsCount = await prisma.document.count({
      where: { userId: demoUser.id }
    });

    if (existingDocsCount > 0) {
      return;
    }

    console.log('🌱 Seeding sample documents for demo user...');

    const sampleDocs = [
      {
        name: 'Calculus III Syllabus & Exam Schedule.pdf',
        description: 'Course syllabus, office hours, and mid-term exam schedule for Fall 2026.',
        category: 'College',
        fileUrl: 'https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus.pdf',
        userId: demoUser.id
      },
      {
        name: 'Computer Architecture Term Paper - Final Draft.docx',
        description: 'Research report on modern RISC-V pipelining and cache hierarchy.',
        category: 'College',
        fileUrl: 'https://arxiv.org/pdf/1607.02318.pdf',
        userId: demoUser.id
      },
      {
        name: 'Apartment Lease Agreement 2026.pdf',
        description: 'Signed rental lease agreement, building guidelines, and security deposit details.',
        category: 'Personal',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      },
      {
        name: 'Passport & Travel Insurance Records.pdf',
        description: 'Scanned copies of international travel documents and emergency medical coverage.',
        category: 'Personal',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      },
      {
        name: 'Q3 Product Roadmap & Engineering OKRs.pptx',
        description: 'Quarterly engineering priorities, sprint goals, and milestone deliverables.',
        category: 'Work',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      },
      {
        name: 'Software Architecture & API Specifications.md',
        description: 'Technical RFC defining REST endpoint contracts, data contracts, and auth models.',
        category: 'Work',
        fileUrl: 'https://www.rfc-editor.org/rfc/rfc9110.pdf',
        userId: demoUser.id
      },
      {
        name: 'Annual Tax Return - 1040 Form (2025).pdf',
        description: 'Federal and state tax return documents with submission receipts.',
        category: 'Finance',
        fileUrl: 'https://www.irs.gov/pub/irs-pdf/f1040.pdf',
        userId: demoUser.id
      },
      {
        name: 'Stock Portfolio & Dividend Summary Q1.xlsx',
        description: 'Monthly investment breakdown, index fund balances, and dividend receipts.',
        category: 'Finance',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      },
      {
        name: 'Electric Bicycle Warranty & Maintenance Log.pdf',
        description: 'Manufacturer warranty terms, purchase invoice, and service schedule.',
        category: 'Other',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      },
      {
        name: 'Home Gym Equipment Assembly Guide.pdf',
        description: 'Assembly diagrams, torque specifications, and replacement parts list.',
        category: 'Other',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        userId: demoUser.id
      }
    ];

    for (const doc of sampleDocs) {
      await prisma.document.create({ data: doc });
    }

    console.log(`✅ Seeded ${sampleDocs.length} sample documents for demo user.`);
  } catch (err) {
    console.warn('⚠️ Seeding skipped or encountered warning:', err.message);
  }
}
