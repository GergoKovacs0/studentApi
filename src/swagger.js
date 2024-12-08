import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const swaggerDocument = YAML.load("./src/swagger.yaml");
export const setupSwagger = (app) => {
  app.use("/users/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
