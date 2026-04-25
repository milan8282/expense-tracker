import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

dotenv.config();

const app = express();

app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  "expense-tracker-one-rose-86.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, please try again later",
  })
);


app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Expense Tracker API is running",
  });
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;