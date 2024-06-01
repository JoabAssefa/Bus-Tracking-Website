import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import { UserRouter } from "./routes/user.js";
import { RecordRouter } from "./routes/record.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/auth", UserRouter);
const connectionString =
  "mongodb+srv://eyoabassefa10:EHHXK4lnq4SfRcHd@test-pro-db.l9mwoop.mongodb.net/?retryWrites=true&w=majority&appName=test-pro-db";
//password kVgc8BJNBkux993j
//new-private-test-pro-db password EHHXK4lnq4SfRcHd username: eyoabassefa10
// connecting string mongodb+srv://vehicle:<password>@cluster0.lxz1826.mongodb.net/
// Connect to the MongoDB Atlas cluster
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

app.listen(process.env.PORT, () => {
  console.log("Server is Running...");
});
