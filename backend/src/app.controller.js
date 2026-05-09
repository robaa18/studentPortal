import connectDB from "./DB/connections.js";
import { announceRouter, authRouter, courseRouter, gradeRouter, scheduleRouter, userRouter } from "./modules/index.js";
import cors from "cors";
import { WHITE_LIST } from "../config/config.service.js";
import { globalErrorHandler } from "./utils/response/error.js";

const bootstrap = async (app, express) => {
  const allowedOrigins = WHITE_LIST.split(",").map((origin) => origin.trim()).filter(Boolean);

  app.use(cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }));
  app.use(express.json());

  await connectDB();

  app.get("/", (req, res) => {
    res.json({ message: "Welcome from Portal-Student" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/course", courseRouter);
  app.use("/api/grades", gradeRouter);
  app.use("/api/schedule", scheduleRouter);
  app.use("/api/user", userRouter);
  app.use("/api/announce", announceRouter);

  app.all("/*dummy", (req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.use(globalErrorHandler);
};

export default bootstrap;
