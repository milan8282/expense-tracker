import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/User.js";
import Expense from "../models/Expense.js";

let agent;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  agent = request.agent(app);

  await agent.post("/api/auth/register").send({
    name: "Expense User",
    email: "expense@example.com",
    password: "123456",
  });
});

afterEach(async () => {
  await User.deleteMany({});
  await Expense.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Expense API", () => {
  test("should create expense", async () => {
    const res = await agent.post("/api/expenses").send({
      amount: 500,
      description: "Lunch",
      date: "2026-04-25",
      category: "Food",
      paymentMethod: "cash",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.expense.category).toBe("Food");
  });

  test("should fetch expenses", async () => {
    await agent.post("/api/expenses").send({
      amount: 500,
      description: "Lunch",
      date: "2026-04-25",
      category: "Food",
      paymentMethod: "cash",
    });

    const res = await agent.get("/api/expenses");

    expect(res.statusCode).toBe(200);
    expect(res.body.expenses.length).toBe(1);
  });
});