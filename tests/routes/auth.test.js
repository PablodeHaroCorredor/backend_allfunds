const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = require("../../../server"); // Ajusta la ruta si es necesario
const User = require("../../models/User"); // Importa el modelo para manipular datos directamente en pruebas

describe("Auth Routes", () => {
  // Conectar a la base de datos de prueba
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Limpiar los datos después de cada prueba
  afterEach(async () => {
    await User.deleteMany({});
  });

  // Cerrar la conexión a la base de datos al final
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /auth/register", () => {
    it("should register a new user with valid data", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ username: "newuser", password: "newpassword", role: "user" });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("User registered");

      const user = await User.findOne({ username: "newuser" });
      expect(user).toBeDefined();
      expect(await bcrypt.compare("newpassword", user.password)).toBe(true);
    });

    it("should fail to register a user with missing fields", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({ username: "incompleteUser" });
      expect(response.statusCode).toBe(500); // Asegúrate de manejar errores de validación si deseas cambiar el status
      expect(response.body.success).toBeUndefined(); // No se define 'success' en errores de servidor
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash("validpassword", 10);
      await new User({
        username: "validuser",
        password: hashedPassword,
        role: "user",
      }).save();
    });

    it("should authenticate a user with valid credentials", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "validuser", password: "validpassword" });
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();

      // Verifica que el token es válido
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
      expect(decoded.username).toBe("validuser");
      expect(decoded.role).toBe("user");
    });

    it("should fail to authenticate with invalid password", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "validuser", password: "invalidpassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid Credentials");
    });

    it("should fail to authenticate non-existent user", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "nonexistentuser", password: "anyPassword" });
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid Credentials");
    });
  });
});
