const db = require("../data/dbConfig");
const request = require("supertest");
const server = require("../server");

const user = {
  username: "Daniel",
  password: "password",
};
const useWrongPassword = {
  username: "Daniel",
  password: "1234",
};
const noUser = {
  password: "password",
};

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});
beforeEach(async () => {
  await db("users").truncate();
});
afterAll(async () => {
  await db.destroy();
});

describe("Post request for authorization router", () => {
    test("errors when missing a username", async () => {
      const res = await request(server).post("/api/auth/register").send(noUser);
      expect(res.body.message).toMatch(/username and password required/i);
    });
    test("adds user to db", async () => {
      const res = await request(server).post("/api/auth/register").send(user);
      let users = await db("users");
      expect(res.body).toMatchObject({ id: 1, username: "Daniel" });
      expect(users).toHaveLength(1);
    });
  });
  describe("login post request tests", () => {

    beforeEach(async () => {
      await request(server).post("/api/auth/register").send(user);
    });

    test("errors when missing a username", async () => {
      const res = await request(server).post("/api/auth/login").send(noUser);
      expect(res.body.message).toMatch(/username and password required/i);
    });

    test("successful login returns correct body", async () => {
      const res = await request(server).post("/api/auth/login").send(user);
      expect(res.body).toHaveProperty("message", "welcome, Daniel");
    });

    test("wrong password return invalid credentials", async () => {
      const res = await request(server)
        .post("/api/auth/login")
        .send(useWrongPassword);
      expect(res.body.message).toMatch(/invalid credentials/i);
    });
  });