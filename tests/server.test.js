const request = require("supertest");
const app = require("../server");

describe("Server", () => {
  it("should respond with a 404 for an unknown route", async () => {
    const response = await request(app).get("/unknownroute");
    expect(response.statusCode).toBe(404);
  });

  it("should respond to the root route", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Welcome to the API"); // Ajusta según tu mensaje de bienvenida
  });
});
