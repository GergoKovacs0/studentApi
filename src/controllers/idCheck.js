export const checkIfIdValid = (id) => {
  if (isNaN(id)) {
    return { status: 400, message: "ID must be a number" };
  }

  if (id < 1) {
    return { status: 422, message: "Invalid ID supplied" };
  }

  return true;
};

export default checkIfIdValid;
