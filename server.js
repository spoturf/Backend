import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

//Routes imports

//Creating express app
const app = express();

//Middlewares
dotenv.config();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

//Route middlewares
app.get("/", (req, res) => {
  res.sendFile(path.resolve("views/index.html"));
});

//App listener
const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Api started 🤍 at ${process.env.BASE_URL + ":" + port}`);
});
