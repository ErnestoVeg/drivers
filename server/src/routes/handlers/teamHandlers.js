const { getTeam } = require("../controllers/teamControllers");

const getTeamHandler = async (req, res)=>{
    try {
        const results = await getTeam();
        res.status(200).json(results);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getTeamHandler
}