import * as userController from "../users.js";
import * as database from "../../database.js";

jest.mock("../../database");

describe("user.js - userController", () => {
  describe("GET - getAllUsers", () => {
    let res;
    let next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
    it("should return all users", async () => {
      const req = {};

      // Mock the dbQuery function to return all users
      database.dbQuery.mockResolvedValue([
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          class: "A",
        },
        {
          id: 2,
          firstName: "John",
          lastName: "Porke",
          email: "adss.daa@example.com",
          class: "A",
        },
        {
          id: 3,
          firstName: "Jophni",
          lastName: "Smith",
          email: "john.doe@example.com",
          class: "A",
        },
      ]);

      await userController.getAllUsers(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          class: "A",
        },
        {
          id: 2,
          firstName: "John",
          lastName: "Porke",
          email: "adss.daa@example.com",
          class: "A",
        },
        {
          id: 3,
          firstName: "Jophni",
          lastName: "Smith",
          email: "john.doe@example.com",
          class: "A",
        },
      ]);
    });
  });

  describe("GET - getUserById", () => {
    let res;
    let next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
    it("should return a user", async () => {
      const req = { params: { id: 1 } };

      // Mock the dbQuery function to return a user
      database.dbQuery.mockResolvedValue([
        {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          class: "A",
        },
      ]);

      await userController.getUserById(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        class: "A",
      });
    });

    it("should return 400 if ID not a number", async () => {
      const req = { params: { id: "asd" } };

      await userController.getUserById(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "ID must be a number",
      });
    });

    it("should return 422 if ID not a valid number", async () => {
      const req = { params: { id: -1 } };

      await userController.getUserById(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid ID supplied",
      });
    });
  });

  describe("POST - createUser", () => {
    let res;
    let next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
    it("should create a user", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      database.dbRun.mockResolvedValue({ lastID: 1 });

      await userController.createUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    it("should return an error while some parameters are missing", async () => {
      const req = {
        body: {
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.createUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return an error while email is invalid", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe",
          className: "A",
        },
      };

      await userController.createUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email",
      });
    });

    it("should return an error while email already exists", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      database.dbRun.mockRejectedValue({
        code: "SQLITE_CONSTRAINT",
      });

      await userController.createUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already exists",
      });
    });
  });

  describe("PUT - updateUser", () => {
    let res;
    let next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });

    it("should update a user", async () => {
      const req = {
        params: { id: 1 },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      // Mock dbRun to simulate a successful update
      database.dbRun.mockResolvedValue({ changes: 1 });

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should return an 400 while id is NaN", async () => {
      const req = {
        params: { id: "asd" },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "ID must be a number",
      });
    });

    it("should return an 422 while ID is invalid", async () => {
      const req = {
        params: { id: -1 },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid ID supplied",
      });
    });

    it("should return an 400 while email is invalid", async () => {
      const req = {
        params: { id: 1 },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe",
          className: "A",
        },
      };

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email",
      });
    });

    it("should return an 400 while some parameters are missing", async () => {
      const req = {
        params: { id: 1 },
        body: {
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "All fields are required",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        params: { id: 1000 },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      database.dbRun.mockResolvedValue({ changes: 0 });

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });
  });

  describe("DELETE - deleteUser", () => {
    let res;
    let next;

    beforeEach(() => {
      jest.clearAllMocks();
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
    it("should delete a user", async () => {
      const req = { params: { id: 1 } };

      database.dbRun.mockResolvedValue({ changes: 1 });

      await userController.deleteUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
    });

    it("should return an 400 while id is NaN", async () => {
      const req = {
        params: { id: "asd" },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.deleteUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "ID must be a number",
      });
    });

    it("should return an 422 while ID is invalid", async () => {
      const req = {
        params: { id: -1 },
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          className: "A",
        },
      };

      await userController.updateUser(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid ID supplied",
      });
    });
  });
});
