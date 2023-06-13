const { Router } = require('express');
const { getTeamHandler } = require("./handlers/teamHandlers"); 

const teamRouter = Router();

teamRouter.get("/", getTeamHandler);

module.exports = teamRouter;