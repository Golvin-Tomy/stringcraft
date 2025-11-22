import request from "supertest";
import app from "../server.js";
import User from "../models/UserModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";

describe("Order Routes", () => {
  let userToken, userId, product;

  beforeAll(async () => {
    const user = new User({ name: "Customer", email: `customer${Date.now()}@example.com`, password: "cust123" });
    await user.save();
    userId = user._id;
    userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    product = await Product.create({ name: "Test Guitar", slug: "test-guitar", price: 500, category: "electric", type: "electric", stock: 10, description: "Test" });
  });

  it("should create a new order", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        items: [{ product: product._id, qty: 2, price: product.price }],
        shippingAddress: { address: "123 Street", city: "City", postalCode: "12345", country: "Country" },
        paymentResult: { id: "pi_123", status: "succeeded" }
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.isPaid).toBe(true);
  });

  it("should get user orders", async () => {
    const res = await request(app)
      .get("/api/orders/myorders")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
