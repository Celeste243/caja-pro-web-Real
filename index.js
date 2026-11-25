import express from "express";
import dotenv from "dotenv";
import { conectarDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productosRoutes from "./routes/productosRoutes.js";
import ventasRoutes from "./routes/ventasRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware de Express para JSON
app.use(express.urlencoded({ extended: true })); // Middleware de Express para formularios HTML
app.use(express.static("public")); // Archivos estáticos

// Motor de vistas Pug
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/", authRoutes);
app.use("/productos", productosRoutes);
app.use("/ventas", ventasRoutes);

try {
  await conectarDB();
} catch (error) {
  console.error("Error al iniciar:", error);
}

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});