import isValidEmail from "../emailCheck";
import checkIfIdValid from "../idCheck";

describe("Validation tests", () => {
  describe("ID validation", () => {
    it("should return true for valid id", () => {
      const id = 1;
      expect(checkIfIdValid(id)).toBe(true);
    });

    it("should return false for negative id", () => {
      const id = -1;
      expect(checkIfIdValid(id)).toStrictEqual({
        status: 422,
        message: "Invalid ID supplied",
      });
    });

    it("should return false for string id", () => {
      const id = "a";
      expect(checkIfIdValid(id)).toStrictEqual({
        status: 400,
        message: "ID must be a number",
      });
    });

    it("should return false for empty id", () => {
      const id = "";
      expect(checkIfIdValid(id)).toStrictEqual({
        status: 400,
        message: "ID must be a number",
      });
    });
  });

  describe("Email validation", () => {
    it("should return true for valid email", () => {
      const email = "asd@gmail.com";
      expect(isValidEmail(email)).toBe(true);
    });

    it("should return false for missing asd", () => {
      const email = "@gmail.com";
      expect(isValidEmail(email)).toBe(false);
    });

    it("should return false for missing gmail", () => {
      const email = "asd@.com";
      expect(isValidEmail(email)).toBe(false);
    });

    it("should return false for missing com", () => {
      const email = "asd@gmail.";
      expect(isValidEmail(email)).toBe(false);
    });

    it("should return false for missing .com", () => {
      const email = "asd@gmail";
      expect(isValidEmail(email)).toBe(false);
    });

    it("should return false for missing at", () => {
      const email = "asdgmail.com";
      expect(isValidEmail(email)).toBe(false);
    });

    it("should return false for empty email", () => {
      const email = "";
      expect(isValidEmail(email)).toBe(false);
    });
  });
});
