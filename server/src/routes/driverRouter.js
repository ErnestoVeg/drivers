const { Router } = require('express');
const {
    getDriverHandler,
    getDriverByNameHandler,
    getDriverByIdHandler,
    createDriverHandler,  } = require("./handlers/driverHandlers");

const driverRouter = Router();

driverRouter.get("/", getDriverHandler)

driverRouter.get("/name", getDriverByNameHandler);

driverRouter.get("/:id", getDriverByIdHandler);

driverRouter.post("/", createDriverHandler);

module.exports = driverRouter;