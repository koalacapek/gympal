import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to Database!");
  } catch (e) {
    console.error(e);
  }
};

connect();

app.use(express.json());

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
