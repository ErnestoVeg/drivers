const { getAllDrivers,
     getDriverById, 
     createDriver, 
     updateDriver, 
     deleteDriver } = require("../controllers/driverControllers");

const allDriversHandler = async (req, res) => {
    try {
        const allDrivers = await getAllDrivers();
        res.status(200).json(allDrivers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const driversByNameHandler = async (req,res) => {
    const { name } = req.query;
    try {
        const driverByName = await getAllDrivers(name);
        res.status(200).json(driverByName);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const driversByIdHandler = async (req,res) => {
    const { id } = req.params;
    try {
        const driverById = await getDriverById(id);
        res.status(200).json(driverById);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const postDriversHandler = async (req,res) => {
    const { forename,surname,description,image,nationality,dob,teams } = req.body;
    try {
        const arrTeams = teams.split(', ')
        const newDriver = await createDriver(forename,surname,description,image,nationality,dob,arrTeams)
        res.status(200).json(newDriver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const updateDriverHandler = async (req,res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedDriver = await updateDriver(id,updateData);
        res.status(200).json(updatedDriver);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteDriverHandler = async (req,res) => {
    const { id } = req.params;
    try {
        const driverDeteled = await deleteDriver(id.trim());
        res.status(200).json(driverDeteled)
    } catch (error) {
        res.status(400).json( { error: error.message })
    }
}

module.exports = {
    allDriversHandler,
    driversByNameHandler, 
    driversByIdHandler,
    postDriversHandler,
    updateDriverHandler,
    deleteDriverHandler, }