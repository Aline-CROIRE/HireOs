import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';
import { errorHandler } from './middleware/errorHandler';
import jobRoutes from './routes/jobRoutes';
import candidateRoutes from './routes/candidateRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.get('/', (req, res) => res.json({ status: "HireOS API is online", docs: "/api-docs" }));
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "";

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Connection Error:', err));