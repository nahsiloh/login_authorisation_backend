const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.mock("jsonwebtoken");

describe("/users", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      });
    } catch (err) {
      console.error(err);
    }
  });

  beforeEach(async () => {
    await User.create([
      { username: "don_draper", email: "don@mail.com", password: "qwertyuiop" }
    ]);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  describe("[POST] users/new", () => {
    it("should add a new user", async () => {
      const addUser = {
        username: "mary_waters",
        email: "mary@mail.com",
        password: "asdfghjkl"
      };
      await request(app)
        .post("/users/new")
        .send(addUser)
        .expect(200);
    });

    it("should return error if inputs are incorrect", async () => {
      const addUser = {
        username: "mary_waters",
        password: "asdfghjkl"
      };
      await request(app)
        .post("/users/new")
        .send(addUser)
        .expect(400);
    });
  });

  describe("[POST] users/login", () => {
    it("should allow a valid user to log in", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ username: "don_draper", password: "qwertyuiop" });

      expect(response.status).toBe(200);
    });

    it("should not allow an invalid user to log in", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ username: "bob_marley", password: "qwertyuiop" });

      expect(response.status).toBe(400);
    });
  });

  describe("[GET]/users/message - protected routes", () => {
    it("denies access when no token is provided", async () => {
      await request(app)
        .get("/users/message")
        .expect(401);

      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it("denies access when user is not authorised", async () => {
      jwt.verify.mockImplementationOnce(() => {
        throw new Error("Unauthorised");
      });
      await request(app)
        .get("/users/message")
        .set("Cookie", "token=invalid-token")
        .expect(401);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
    });

    it("grants access when user is authorised", async () => {
      jwt.verify.mockReturnValueOnce({});

      await request(app)
        .get("/users/message")
        .set("Cookie", "token=valid-token")
        .expect(200);

      expect(jwt.verify).toHaveBeenCalledTimes(1);
    });
  });

  describe("[POST] users/logout", () => {
    it("should allow a logged in user to logout", async () => {
      await request(app)
        .post("/users/logout")
        .expect(200);
    });
  });
});
