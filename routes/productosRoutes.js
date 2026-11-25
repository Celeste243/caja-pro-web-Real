import express from "express";
import {
  obtenerProductosVista,
  obtenerProductosApi,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productosController.js";

const router = express.Router();

router.get("/", obtenerProductosVista);
router.get("/api", obtenerProductosApi);
router.get("/:id", obtenerProductoPorId);
router.post("/", crearProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id", eliminarProducto);

export default router;