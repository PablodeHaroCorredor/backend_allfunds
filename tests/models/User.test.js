const User = require("../models/User");

describe("User Model", () => {
  it("should be defined", () => {
    expect(User).toBeDefined();
  });

  it("should create a new user with username, password, and email", () => {
    const userInstance = new User({
      username: "testuser",
      password: "securepassword",
      email: "test@example.com",
    });
    expect(userInstance.username).toBe("testuser");
    expect(userInstance.password).toBe("securepassword");
    expect(userInstance.email).toBe("test@example.com");
  });

  it("should validate required fields", () => {
    const userInstance = new User({});
    const validationError = userInstance.validateSync();
    expect(validationError.errors["username"]).toBeDefined();
    expect(validationError.errors["password"]).toBeDefined();
    expect(validationError.errors["email"]).toBeDefined();
  });

  it("should hash password before saving", async () => {
    const userInstance = new User({
      username: "hashuser",
      password: "plaintext",
      email: "hash@example.com",
    });
    await userInstance.save();
    expect(userInstance.password).not.toBe("plaintext"); // Assuming password is hashed
  });

  it("should authenticate with correct credentials", async () => {
    const userInstance = new User({
      username: "authuser",
      password: "authpass",
      email: "auth@example.com",
    });
    await userInstance.save();
    const isAuthenticated = await userInstance.authenticate("authpass");
    expect(isAuthenticated).toBe(true);
  });
});
