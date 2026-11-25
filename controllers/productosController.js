import Producto from "../models/Producto.js";

// Obtener todos los productos (API JSON)
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

// Crear producto con validación estricta
export const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ mensaje: "El nombre del producto es obligatorio." });
    }

    const precioNum = Number(precio);
    const stockNum = Number(stock);

    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({ mensaje: "El precio debe ser un número mayor a 0." });
    }

    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      return res.status(400).json({ mensaje: "El stock debe ser un número entero mayor o igual a 0." });
    }

    const nuevoProducto = new Producto({
      nombre: nombre.trim(),
      precio: precioNum,
      stock: stockNum
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(400).json({ mensaje: "Datos inválidos al crear el producto." });
  }
};

// Modificar producto con validación estricta
export const actualizarProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ mensaje: "El nombre del producto es obligatorio." });
    }

    const precioNum = Number(precio);
    const stockNum = Number(stock);

    if (isNaN(precioNum) || precioNum <= 0) {
      return res.status(400).json({ mensaje: "El precio debe ser un número mayor a 0." });
    }

    if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
      return res.status(400).json({ mensaje: "El stock debe ser un número entero mayor o igual a 0." });
    }

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre: nombre.trim(), precio: precioNum, stock: stockNum },
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ mensaje: "Producto no encontrado." });
    }

    res.json(productoActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el producto." });
  }
};

// Eliminar producto
export const eliminarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al eliminar el producto." });
  }
};