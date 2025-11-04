import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import cors from 'cors';

import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import commentRoute from './routes/comment.route.js';
import notificationRoute from './routes/notification.route.js';
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/comment', commentRoute);
app.use('/api/notification', notificationRoute);

app.get('/', (req, res) => {
  res.send('Hello from Vercel backend!');
});

await connectDB();

// ❌ app.listen yok!
// çünkü Vercel kendi ortamında dinliyor

export default app;
