const express = require("express");
const healthcheckController = require("../controllers/healthcheckController");

const router = express.Router();

router.get("/healthcheck", healthcheckController.healthcheck);

module.exports = router;
