import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let memServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bittaalo';

  try {
    // Attempt connecting to the configured URI with a quick 3s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[DB] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[DB] Could not connect to external MongoDB at ${uri} (${err.message}).`);
    console.log('[DB] Launching embedded MongoDB memory server for zero-config operation...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memServer = await MongoMemoryServer.create({
        instance: { dbName: 'bittaalo' },
      });
      const memUri = memServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[DB] Embedded MongoDB Memory Server Connected: ${memUri}`);
      return conn;
    } catch (innerErr) {
      console.error('[DB] Failed to initialize embedded MongoDB:', innerErr.message);
      throw innerErr;
    }
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memServer) {
    await memServer.stop();
  }
};
