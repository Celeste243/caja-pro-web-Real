import express from "express";
import {
  obtenerVentasApi,
  registrarVenta
} from "../controllers/ventasController.js";

const router = express.Router();

router.get("/api", obtenerVentasApi);
router.post("/", registrarVenta);

export default router;