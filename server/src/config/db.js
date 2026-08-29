import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

let isConnected = false;

export function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('localhost')) {
    logger.info('Running with resilient in-memory session store for local development.');
    isConnected = false;
    return;
  }
  
  mongoose.set('strictQuery', false);
  mongoose.connect(uri, {
    serverSelectionTimeoutMS: 2000,
  }).then((conn) => {
    isConnected = true;
    logger.success(`MongoDB Connected: ${conn.connection.host}`);
  }).catch((error) => {
    logger.warn(`MongoDB Notice: ${error.message} - Using in-memory store.`);
    isConnected = false;
  });
}

export function isDbConnected() {
  return isConnected;
}

