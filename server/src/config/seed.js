/**
 * Seeds sample documents into the database if empty.
 */
export async function seedSampleDocuments(prisma) {
  try {
    const count = await prisma.document.count();
    if (count > 0) {
      return;
    }

    console.log('🌱 Seeding sample documents for quick start...');

    const sampleDocs = [
      {
        name: 'Calculus III Syllabus & Exam Schedule.pdf',
        description: 'Course syllabus, office hours, and mid-term exam schedule for Fall 2026.',
        category: 'College',
        fileUrl: 'https://ocw.mit.edu/ans7870/resources/Strang/Edited/Calculus.pdf'
      },
      {
        name: 'Computer Architecture Term Paper - Final Draft.docx',
        description: 'Research report on modern RISC-V pipelining and cache hierarchy.',
        category: 'College',
        fileUrl: 'https://arxiv.org/pdf/1607.02318.pdf'
      },
      {
        name: 'Apartment Lease Agreement 2026.pdf',
        description: 'Signed rental lease agreement, building guidelines, and security deposit details.',
        category: 'Personal',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        name: 'Passport & Travel Insurance Records.pdf',
        description: 'Scanned copies of international travel documents and emergency medical coverage.',
        category: 'Personal',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        name: 'Q3 Product Roadmap & Engineering OKRs.pptx',
        description: 'Quarterly engineering priorities, sprint goals, and milestone deliverables.',
        category: 'Work',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        name: 'Software Architecture & API Specifications.md',
        description: 'Technical RFC defining REST endpoint contracts, data contracts, and auth models.',
        category: 'Work',
        fileUrl: 'https://www.rfc-editor.org/rfc/rfc9110.pdf'
      },
      {
        name: 'Annual Tax Return - 1040 Form (2025).pdf',
        description: 'Federal and state tax return documents with submission receipts.',
        category: 'Finance',
        fileUrl: 'https://www.irs.gov/pub/irs-pdf/f1040.pdf'
      },
      {
        name: 'Stock Portfolio & Dividend Summary Q1.xlsx',
        description: 'Monthly investment breakdown, index fund balances, and dividend receipts.',
        category: 'Finance',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        name: 'Electric Bicycle Warranty & Maintenance Log.pdf',
        description: 'Manufacturer warranty terms, purchase invoice, and service schedule.',
        category: 'Other',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      },
      {
        name: 'Home Gym Equipment Assembly Guide.pdf',
        description: 'Assembly diagrams, torque specifications, and replacement parts list.',
        category: 'Other',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      }
    ];

    for (const doc of sampleDocs) {
      await prisma.document.create({ data: doc });
    }

    console.log(`✅ Seeded ${sampleDocs.length} sample documents.`);
  } catch (err) {
    console.warn('⚠️ Seeding skipped or encountered warning:', err.message);
  }
}
