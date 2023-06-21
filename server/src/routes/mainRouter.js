const { Router } = require("express");
const driversRouter = require("./driversRouter");
const teamsRouter = require("./teamsRouter");
const axios = require("axios")

const mainRouter = Router();

mainRouter.use("/drivers", driversRouter);
mainRouter.use("/teams", teamsRouter);
mainRouter.get("/prueba", async(req, res) => {
    try{
        const info = await axios.get("http://localhost:5000/drivers")
        res.status(200).json(info.data)
    }catch(err){
        res.status(400).json({error: err.message})
    }
})

module.exports = mainRouter;
