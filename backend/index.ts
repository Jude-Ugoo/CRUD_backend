import express, { Express, Request, Response } from "express";
import { database } from "./utils/db";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import { checkHeader } from "./middlewares/auth";
import userRoutes from "./routes/users";

const app: Express = express();
const PORT = process.env.PORT || 8001;
app.use(express.json());
app.use(cookieParser());
database();

// Middlewares
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
