import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();


(async () => {
  try {
    await connectDB();
    
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    
    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

export default app;
