import Producto from "../models/Producto.js";
import Venta from "../models/Venta.js";

// GET API: devuelve el historial de ventas
const obtenerVentasApi = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ createdAt: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ventas" });
  }
};

// POST: registra una venta y descuenta el stock del producto
const registrarVenta = async (req, res) => {
  try {
    const { productoId, cantidad } = req.body;
    const cantidadNumero = Number(cantidad);

    // 1. Buscamos el producto en MongoDB
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // 2. Verificamos que haya stock suficiente
    if (cantidadNumero <= 0 || producto.stock < cantidadNumero) {
      return res.status(400).json({ mensaje: "Stock insuficiente" });
    }

    // 3. Descontamos el stock y guardamos el producto actualizado
    producto.stock = producto.stock - cantidadNumero;
    await producto.save();

    // 4. Calculamos el total y guardamos la venta
    const total = producto.precio * cantidadNumero;
    const nuevaVenta = new Venta({
      productoNombre: producto.nombre,
      cantidad: cantidadNumero,
      precioUnitario: producto.precio,
      total: total
    });

    const ventaGuardada = await nuevaVenta.save();
    res.status(201).json(ventaGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar la venta" });
  }
};

export {
  obtenerVentasApi,
  registrarVenta
};