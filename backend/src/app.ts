import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
import chatRoute from "./modules/chat/chat.route";
import projectRoute from "./modules/project/project.route";
import router from "./routes";

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use("/", router);


process.on("unhandledRejection", (reason) => {
	console.error("Unhandled Rejection:", reason);
});

// Start server
app.listen(PORT, () => {
	console.log(`🚀 Server is running on port ${PORT}`);
	console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
