const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../server"); // Ajusta la ruta si es necesario
const New = require("../../models/New"); // Importa el modelo directamente para manipular datos

describe("News Routes", () => {
  // Conectar a la base de datos de prueba
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Limpiar los datos después de cada prueba
  afterEach(async () => {
    await New.deleteMany({});
  });

  // Cerrar la conexión a la base de datos al final
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /news", () => {
    it("should fetch all news", async () => {
      const newsItem = new New({
        title: "Sample News",
        content: "Sample Content",
        author: "Author",
      });
      await newsItem.save();

      const response = await request(app).get("/news");
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Sample News");
    });
  });

  describe("POST /news", () => {
    it("should create a new news item with valid data", async () => {
      const response = await request(app)
        .post("/news")
        .send({ title: "New News", content: "Some content", author: "Author" });
      expect(response.statusCode).toBe(200);
      expect(response.body._id).toBeDefined();
      expect(response.body.title).toBe("New News");
    });

    it("should fail to create news with invalid data", async () => {
      const response = await request(app).post("/news").send({ title: "" });
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error al crear la noticia");
    });
  });

  describe("PUT /news/:id/archive", () => {
    it("should archive a news item successfully", async () => {
      const newsItem = new New({
        title: "News to Archive",
        content: "Archivable content",
        author: "Author",
      });
      const savedNews = await newsItem.save();

      const response = await request(app).put(`/news/${savedNews._id}/archive`);
      expect(response.statusCode).toBe(200);
      expect(response.body.archiveDate).toBeDefined();
    });

    it("should return 500 if archiving a non-existent news item", async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app).put(`/news/${invalidId}/archive`);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error al archivar la noticia");
    });
  });

  describe("GET /news/active", () => {
    it("should fetch all active news", async () => {
      const activeNews = new New({
        title: "Active News",
        content: "Active content",
        author: "Author",
        archiveDate: null,
      });
      const archivedNews = new New({
        title: "Archived News",
        content: "Archived content",
        author: "Author",
        archiveDate: new Date(),
      });
      await activeNews.save();
      await archivedNews.save();

      const response = await request(app).get("/news/active");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Active News");
    });
  });

  describe("GET /news/archived", () => {
    it("should fetch all archived news", async () => {
      const activeNews = new New({
        title: "Active News",
        content: "Active content",
        author: "Author",
        archiveDate: null,
      });
      const archivedNews = new New({
        title: "Archived News",
        content: "Archived content",
        author: "Author",
        archiveDate: new Date(),
      });
      await activeNews.save();
      await archivedNews.save();

      const response = await request(app).get("/news/archived");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].title).toBe("Archived News");
    });
  });

  describe("DELETE /news/:id", () => {
    it("should delete a news item successfully", async () => {
      const newsItem = new New({
        title: "News to Delete",
        content: "Content to delete",
        author: "Author",
      });
      const savedNews = await newsItem.save();

      const response = await request(app).delete(`/news/${savedNews._id}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Noticia eliminada correctamente");

      const foundNews = await New.findById(savedNews._id);
      expect(foundNews).toBeNull();
    });

    it("should return 500 if trying to delete a non-existent news item", async () => {
      const invalidId = new mongoose.Types.ObjectId();
      const response = await request(app).delete(`/news/${invalidId}`);
      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe("Error al eliminar la noticia");
    });
  });
});
