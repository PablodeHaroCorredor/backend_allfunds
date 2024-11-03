require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:4200", // Dominio del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Permitir el encabezado Authorization
  })
);

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Crear el servidor HTTP y pasar la aplicación Express
const server = http.createServer(app);

// Importar rutas
const newsRoutes = require("./src/routes/news/newRoutes");
const authRoutes = require("./src/routes/auth/auth");
app.use("/news", newsRoutes);
app.use("/auth", authRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in port ${PORT}`));
