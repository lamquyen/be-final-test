import express from "express";

import connect from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import teacherRoutes from "./router/teacherRoutes.js";
const app = express();
dotenv.config();
//connect to DB
connect()

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", teacherRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server is running!");
});
