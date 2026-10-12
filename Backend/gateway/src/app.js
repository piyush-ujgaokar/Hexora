import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import proxy from "express-http-proxy";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controllers/user.controller.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE, {
    proxyReqPathResolver: (req) => {
      return `/auth${req.url}`;
    },
  }),
);

app.use(
  "/api/project",
  authMiddleware,
  proxy(process.env.PROJECT_SERVICE, {
    proxyReqPathResolver: (req) => {
      return `/project${req.url}`;
    },
  }),
);
app.get("/api/me", authMiddleware, getCurrentUser);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Gateway Server is healthy",
  });
});

export default app;
