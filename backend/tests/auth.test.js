import request from "supertest";
import app from "../server.js"; // Express app
import User from "../models/User.js";

describe("Auth Routes", () => {
  const userData = { name: "Test User", email: "test@example.com", password: "password123" };

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("_id");
  });

  it("should login an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "wrongpassword" });
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
