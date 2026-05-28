import express  , {type Request, type Response}from "express"
const router = express.Router();
import dotenv from "dotenv";
import Users from "../models/users";
import {loginSchema, userSchema} from "../zod/index";

dotenv.config();



router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = userSchema.parse(req.body);
    const user = new Users(name, email, password, parseInt(phone), new Date(), new Date());
    const newUser = await user.createUser(name, email, password, parseInt(phone));
    res.status(201).json(newUser);

  } catch (e: any) {
  console.error("PG Error:", e.cause?.message ?? e.message ?? e);
  res.status(500).json({ error: e.cause?.message ?? e.message });
}
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = new Users("", email, password, 0, new Date(), new Date());
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

const userRoute = router;
export default userRoute;