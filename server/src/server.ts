import express, { Express, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.model";
import { register } from "./auth";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in the environment variables");
}

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
app.use(cors());
app.use(morgan(":method :url :status"));

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

app.post("/user/create", async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName, photo } = req.body;
  try {
    const token = await register({
      email,
      password,
      username,
      firstName,
      lastName,
      photo,
    });
    return res.json({ token });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
