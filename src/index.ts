// Main component of Application
import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerOptions from './config/swagger';
import connectDB from './config/database';

const app = express();
app.use(express.json());
connectDB();

// Swagger setup
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes from the routes index
app.use('/api/v1', routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API docs are available at http://localhost:${PORT}/api-docs`);
});
