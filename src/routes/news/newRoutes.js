const express = require("express");
const New = require("../../models/New");
const router = express.Router();

// Obtener todas las noticias
router.get("/", async (req, res) => {
  const news = await New.find().sort({ date: -1 });
  res.json(news);
});

// Agregar noticia
router.post("/", async (req, res) => {
  try {
    const newNews = new New({
      ...req.body,
      archiveDate: null,
    });
    await newNews.save();

    res.json(newNews);
  } catch (error) {
    console.error("Error al crear la noticia:", error);
    res.status(500).json({ message: "Error al crear la noticia" });
  }
});

// Archivar noticia
router.put("/:id/archive", async (req, res) => {
  try {
    const news = await New.findByIdAndUpdate(
      req.params.id,
      { archiveDate: new Date() },
      { new: true }
    );

    res.json(news);
  } catch (error) {
    console.error("Error al archivar la noticia:", error);
    res.status(500).json({ message: "Error al archivar la noticia" });
  }
});

router.get("/active", async (req, res) => {
  try {
    // Filtra las noticias que no tienen una fecha en archivedDate
    const activeNews = await New.find({ archiveDate: null }).sort({ date: -1 });
    res.json(activeNews); // Devuelve las noticias activas en formato JSON
  } catch (error) {
    console.error("Error al obtener las noticias activas:", error);
    res.status(500).json({ message: "Error al obtener las noticias activas" });
  }
});

// Endpoint para obtener todas las noticias archivadas
router.get("/archived", async (req, res) => {
  try {
    // Filtra las noticias que tienen una fecha en archivedDate
    const archivedNews = await New.find({ archiveDate: { $ne: null } }).sort({
      archiveDate: -1,
    });

    res.json(archivedNews); // Devuelve las noticias archivadas en formato JSON
  } catch (error) {
    console.error("Error al obtener las noticias archivadas:", error);
    res
      .status(500)
      .json({ message: "Error al obtener las noticias archivadas" });
  }
});

// Eliminar noticia
router.delete("/:id", async (req, res) => {
  try {
    await New.findByIdAndDelete(req.params.id);

    res.json({ message: "Noticia eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la noticia:", error);
    res.status(500).json({ message: "Error al eliminar la noticia" });
  }
});

module.exports = router;
