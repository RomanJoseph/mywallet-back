import express from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/authRoute.js"
import transactionRoute from "./routes/transactionRoute.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRoutes)
app.use(transactionRoute)


app.listen("5000", () => console.log("Magic Happens on 5000"))