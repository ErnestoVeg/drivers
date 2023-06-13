const axios = require('axios');
const { Driver , Team } = require("../../db");
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

const getAllDrivers = async (name) => {
    const allDriversDb = await Driver.findAll({
        where:{
            name: {
                [Op.iLike]: `%${buscar}%`
            }
        },
        include: {
            model: Team,
            attributes: ["name"],
            through: {
                attributes: [],
            },
        }
    });
    
    const peticion = (await axios("http://localhost:5000/drivers")).data;
    const allDriversApi = peticion.map((driver) => {
        return {
            id: driver.id,
            forename: driver.name.forename,
            surname: driver.name.surname,
            description: driver.description || "",
            image: driver.image.url,
            nationality: driver.nationality,
            dob: driver.dob,
            teams: driver.teams,
  
        };
    })
    
    allDriversDb = [...allDriversApi, ...allDriversDb];

    if (name) {
        driversByName = allDrivers.filter((driver) => 
        driver.forename.toLowerCase().startsWith(name.toLowerCase()));
        if (driversByName.length) {
            return driversByName.slice(0, 15);
        } else {
            throw new Error(`No se encontro por el nombre: ${name}`);
        }
    } 
    
    return allDriversDb
}

const getDriverById = async (id) => {
    let driverById;

    if (isNaN(id)) {
        driverById = await Driver.findByPk(id);
        if (!driverById) { 
            throw new Error(`Conductor con id: ${id} no encontrado en la base de datos`);
        }
    } else {
        try {
            const response = await axios.get(`http://localhost:5000/drivers/${id}`);
            driverById = response.data;
        } catch (error) { 
            throw new Error(`Counductor con id: ${id} no encontrado en la API`);
        }
    }

    return driverById;
}

const postDriver = async (forename,surname,description,image,nationality,dob, arrTeams) => {
    const existingDriver = await Driver.findOne({
        where: {
          forename,
          surname,
        },
      });
      if (existingDriver) {
        const error = new Error('el piloto ya existe');
        error.status = 400; 
        throw error;
      }
    
    const newDriver = await Driver.create({
        forename,
        surname,
        description,
        image,
        nationality,
        dob
    })

    for (const teamName of arrTeams) {
      const [team, created] = await Team.findOrCreate({
        where: { name: teamName },
      });
      await newDriver.addTeam(team);
    }

      return newDriver;
}

module.exports = {
postDriver,
getAllDrivers,
getDriverById
}