const express = require("express");
const asyncHandler = require("express-async-handler");
const { startProcess, configProcess } = require("./services");
const { rest } = require("../../../config");
const logger = require("../../../services/logger");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    res.success({ status: 200, message: "ok" });
  })
);

router.post(
  "/test",
  asyncHandler((req, res) => {
    const { body, query } = req;
    const { loop, queries, delay } = query;
    configProcess({ loop, delayPerQuery: delay, queries });
    startProcess(body);
    res.success({ status: 200, message: "ok" });
  })
);

module.exports = router;
