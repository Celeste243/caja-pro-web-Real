import dns from "dns";
import mongoose from "mongoose";

// Forzamos servidores DNS públicos para evitar bloqueo de consultas SRV
dns.setServers(["8.8.8.8", "1.1.1.1"]);

export const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};