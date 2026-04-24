import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HireOS API — Umurava AI Recruitment Platform',
      version: '1.0.0',
      description: 'AI-powered recruitment intelligence platform built for the Umurava Hackathon.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://hireos-api.onrender.com', // Replace with your Render URL later
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/server.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);