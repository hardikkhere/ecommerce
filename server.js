import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoute.js";
import cors from "cors";

const app = express();

// configure dotenv
dotenv.config();

// REMEMBER TO SET DOTENV CONFIG BEFORE SETTING UP DATABASE CONNECTION
// Database Config
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
  res.send({
    message: "welcome to ecommerce app",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${process.env.MODE} on port ${PORT}`.bgCyan.white
  );
});
