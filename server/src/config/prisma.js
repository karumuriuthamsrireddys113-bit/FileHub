import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

let prismaInstance = null;

/**
 * Initializes and returns the PrismaClient instance.
 * If DATABASE_URL is not set or empty, starts a local in-memory MongoDB replica set
 * so the application can run out-of-the-box for local development and testing.
 */
export async function initializeDatabase() {
  if (prismaInstance) {
    return prismaInstance;
  }

  let dbUrl = process.env.DATABASE_URL?.trim();

  const isProduction = process.env.NODE_ENV === 'production';

  // If no DATABASE_URL is configured or default placeholder is left unchanged
  if (!dbUrl || dbUrl.includes('username:password@cluster0.example.mongodb.net')) {
    if (isProduction) {
      console.error('\n❌ CRITICAL PRODUCTION CONFIGURATION ERROR:');
      console.error('DATABASE_URL is not configured for production environment!');
      console.error('Please set a valid MongoDB Atlas connection string in your Render Environment Variables.');
      console.error('Format: DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xyz.mongodb.net/filehub?retryWrites=true&w=majority"\n');
      throw new Error('DATABASE_URL environment variable is required in production.');
    }

    console.log('ℹ️  No external MongoDB URL detected in .env.');
    console.log('🚀 Starting local MongoDB Replica Set for development/testing...');

    try {
      const { MongoMemoryReplSet } = await import('mongodb-memory-server');
      const replSet = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' }
      });

      dbUrl = replSet.getUri('filehub');
      process.env.DATABASE_URL = dbUrl;
      console.log(`✅ Local MongoDB Replica Set started at: ${dbUrl}`);

      // Graceful shutdown
      process.on('SIGINT', async () => {
        if (prismaInstance) await prismaInstance.$disconnect();
        await replSet.stop();
        process.exit(0);
      });
      process.on('SIGTERM', async () => {
        if (prismaInstance) await prismaInstance.$disconnect();
        await replSet.stop();
        process.exit(0);
      });
    } catch (err) {
      console.error('❌ Failed to start local MongoDB Replica Set:', err.message);
      console.error('💡 Please supply a valid DATABASE_URL in your server/.env file.');
      throw err;
    }
  } else {
    // Mask password in log output for safety
    const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
    console.log(`🔌 Connecting to MongoDB database via Prisma (${maskedUrl})...`);
  }

  prismaInstance = new PrismaClient({
    datasources: {
      db: { url: dbUrl }
    }
  });

  await prismaInstance.$connect();
  console.log('✅ Prisma connected to MongoDB successfully.');

  return prismaInstance;
}

export async function disconnectDatabase() {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
}

export function getPrisma() {
  if (!prismaInstance) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prismaInstance;
}
