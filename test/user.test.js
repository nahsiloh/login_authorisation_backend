const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

describe("/clients", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

      const mongoUri = await mongoServer.getUri("login-test-db");
      console.log(mongoUri);
      await mongoose.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
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

  describe("[GET]", () => {
    it("returns all users", async () => {
      const expectedUsers = [
        {
          username: "don_draper",
          email: "don@mail.com",
          password: "qwertyuiop"
        }
      ];
      await request(app)
        .get("/users")
        .expect(200)
        .expect(({ body: actualUsers }) => {
          expectedUsers.forEach((user, index) => {
            expect(actualUsers[index]).toEqual(expect.objectContaining(user));
          });
        });
    });
  });

  describe("[POST]", () => {
    it("adds a new client", async () => {
      const expectedUsers = [
        {
          username: "don_draper",
          email: "don@mail.com",
          password: "qwertyuiop"
        },
        {
          username: "bob_barker",
          email: "bob@mail.com",
          password: "asdfghjkl"
        }
      ];
      const addUser = {
        username: "bob_barker",
        email: "bob@mail.com",
        password: "asdfghjkl"
      };
      return request(app)
        .post("/users/new")
        .send(addUser)
        .expect(200);
    });
  });

  describe("[PATCH]", () => {});
});
