import request from "supertest";
import app from "../server.js";
import User from "../models/UserModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";

describe("Product Routes", () => {
  let adminToken;

  beforeAll(async () => {
    const admin = new User({ name: "Admin", email: `admin${Date.now()}@example.com`, password: "admin123", role: "admin" });
    await admin.save();
    adminToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  });

  it("should create a product (admin)", async () => {
    const res = await request(app)
      .post("/api/products/admin")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Guitar 1", slug: "guitar-1", price: 500, category: "electric", type: "electric", stock: 10, description: "Nice guitar" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Guitar 1");
  });

  it("should get products list", async () => {
    await Product.create({ name: "Guitar 2", slug: "guitar-2", price: 300, category: "acoustic", type: "acoustic", stock: 5, description: "Acoustic guitar" });
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a product (admin)", async () => {
    const product = await Product.create({ name: "Guitar 3", slug: "guitar-3", price: 400, category: "ukulele", type: "ukulele", stock: 7, description: "Ukulele" });
    const res = await request(app)
      .put(`/api/products/admin/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 450 });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.price).toBe(450);
  });

  it("should delete a product (admin)", async () => {
    const product = await Product.create({ name: "Guitar 4", slug: "guitar-4", price: 600, category: "electric", type: "electric", stock: 2, description: "Electric guitar" });
    const res = await request(app)
      .delete(`/api/products/admin/${product._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
