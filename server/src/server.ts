import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.model";

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

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

app.post("/user/create", async (req: Request, res: Response) => {
  const detail = {
    email: req.body.email,
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    photo: req.body.photo,
  };
  try {
    const newUser = await User.create(detail);
    res.status(200).json(newUser);
  } catch (e) {
    console.error(e);
    res.status(400);
  }
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
