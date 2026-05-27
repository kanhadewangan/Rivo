import express from "express";
import cors from "cors";
import userRoute from "./api/user.route";
import riderRoute from "./api/rider.route";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoute);
app.use("/riders", riderRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});