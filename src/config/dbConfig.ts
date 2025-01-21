import mongoose from 'mongoose';

export const connectToDatabase = async (database: string) => {
  try {
    await mongoose.connect(database);
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};
