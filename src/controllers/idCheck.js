export const isValidId = (id) => {
  if (isNaN(id) || id === "") {
    return { status: 400, message: "ID must be a number" };
  }

  if (id < 1) {
    return { status: 422, message: "Invalid ID supplied" };
  }

  return true;
};

export default isValidId;
