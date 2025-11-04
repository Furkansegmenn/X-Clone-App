import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import {clerkMiddleware} from '@clerk/express';
import cors from 'cors';

import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';


const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());


app.use('/api/users',userRoute);
app.use('/api/posts', postRoute)


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
