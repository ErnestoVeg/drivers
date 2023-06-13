const { getAllDrivers, getDriverById, postDriver} = require("../controllers/driverControllers");

const getDriverHandler = async (req, res) => {
    try {
        const allDrivers = await getAllDrivers();
        res.status(200).json(allDrivers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getDriverByNameHandler = async (req,res) => {
    const { name } = req.query;
    try {
        const driverByName = await getAllDrivers(name);
        res.status(200).json(driverByName);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getDriverByIdHandler = async (req,res) => {
    const { id } = req.params;
    try {
        const driverById = await getDriverById(id);
        res.status(200).json(driverById);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const createDriverHandler = async (req,res) => {
    const { forename,surname,description,image,nationality,dob,teams } = req.body;
    try {
        const arrTeams = teams.split(', ')
        const newDriver = await postDriver(forename,surname,description,image,nationality,dob,arrTeams)
        res.status(200).json(newDriver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    getDriverHandler,
    getDriverByNameHandler, 
    getDriverByIdHandler,
    createDriverHandler, }