import { RegisterProps } from "../types";
import User from "./models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

export const register = async (props: RegisterProps) => {
  const { email, password, username, firstName, lastName, photo } = props;

  // Validate input data
  if (!email || !password || !username || !firstName || !lastName || !photo) {
    throw new Error("All fields are required");
  }

  // Check if user already exists
  let existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error("User already exists with this email");
    } else if (existingUser.username === username) {
      throw new Error("User already exists with this username");
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create new user
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    firstName,
    lastName,
    photo,
  });

  await newUser.save();

  // Generate token
  const token = jwt.sign({ userId: newUser._id, email }, secret, {
    algorithm: "HS256",
  });

  return token;
};
