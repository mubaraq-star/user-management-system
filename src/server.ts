import express from 'express';
import userRoutes from './routes/userRoutes';
import addressRoutes from './routes/addressRoutes';
import postRoutes from './routes/postRoutes';
import { errorHandler } from './utils/errorHandler';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use(userRoutes);
app.use(addressRoutes);
app.use(postRoutes);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

if (process.env.NODE_ENV !== 'test') {
  console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
export default app;