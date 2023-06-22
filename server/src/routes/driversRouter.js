const { Router } = require('express');
const {//rutas...
    allDriversHandler,
    driversByIdHandler,
    driversByNameHandler,
    postDriversHandler,
    updateDriverHandler,
    deleteDriverHandler,} = require("./handlers/driverHandlers");

const driversRouter = Router();

driversRouter.get("/", allDriversHandler)

driversRouter.get("/name", driversByNameHandler);

driversRouter.get("/:id", driversByIdHandler);

driversRouter.post("/", postDriversHandler);

driversRouter.delete('/:id', deleteDriverHandler)

driversRouter.put('/:id', updateDriverHandler)

module.exports = driversRouter;