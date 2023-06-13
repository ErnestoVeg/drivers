const { Router } = require("express");
const driverRouter = require("./driverRouter");
const teamRouter = require("./teamRouter");

const mainRouter = Router();

mainRouter.use("/driver", driverRouter);
mainRouter.use("/team", teamRouter);

module.exports = mainRouter;
