import express, { Request, Response, Application, NextFunction } from 'express';
import { AppDataSource } from "./data-source";
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import routes from './routes';
import { HttpException } from './exceptions/HttpException';

// Get port with fallback
const port: number = parseInt(process.env.PORT || '3000', 10);

// establish database connection
AppDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error)
  });

// setup express app
const app: Application = express();

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// register routes
app.use("/", routes);

// Error handling middleware
app.use((error: Error, request: Request, response: Response, next: NextFunction) => {

  console.error(error);

  const isJson = request.accepts('json');
  const status = error instanceof HttpException ? error.status : 500;
  const message = error.message || 'Internal Server Error';
  
  if (isJson) {

    response.status(status).json({
      success: false,
      message,
    });

  } else {

    response.status(status).send(`
      <html>
        <head>
          <title>${status} - Error</title>
        </head>
        <body>
          <h1>${status} - ${message}</h1>
        </body>
      </html>
    `);
  }
});

// Server startup
app.listen(port, (): void => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});