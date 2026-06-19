import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to Database
    await connectDB();
    
    // Start Server
    app.listen(config.PORT, () => {
      console.log(`🚀 Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();