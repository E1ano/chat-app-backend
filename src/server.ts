import { connectToDatabase } from './config/dbConfig.js';
import app from './app.js';

const PORT: number = parseInt(process.env.PORT as string) || 3000;
const DATABASE: string = process.env.DATABASE as string;

const startServer = async (): Promise<void> => {
  try {
    // Connect to the database
    await connectToDatabase(DATABASE);
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1); // Terminate the process if the database fails to connect
  }
};

startServer();
