const express = require("express");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");

const authRoutes = require("./routes/authRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const healthcheckRoutes = require("./routes/healthcheckRoutes");

const app = express();
app.use(express.json());

const swaggerPath = path.join(__dirname, "docs", "swagger.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(authRoutes);
app.use(checkoutRoutes);
app.use(healthcheckRoutes);

module.exports = app;
