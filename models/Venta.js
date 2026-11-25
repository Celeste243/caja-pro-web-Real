import mongoose from "mongoose";

const ventaSchema = new mongoose.Schema({
  productoNombre: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model("Venta", ventaSchema);