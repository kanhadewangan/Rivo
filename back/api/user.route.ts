import express  , {type Request, type Response}from "express"
const router = express.Router();
import dotenv from "dotenv";
import Users from "../models/users";
import {userSchema} from "../zod/index";

dotenv.config();



router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password ,phone} = userSchema.parse(req.body);
    const user = new Users(Math.floor(Math.random() * 1000000), name, email, phone, new Date(), new Date());
    const newUser = user.createUser(name, email, phone);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = userSchema.parse(req.body);
    const user = new Users(Math.floor(Math.random() * 1000000), "", email, 0, new Date(), new Date());
    const loggedInUser = await user.loginUser(email);
    if (loggedInUser) {
      res.status(200).json(loggedInUser);
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;