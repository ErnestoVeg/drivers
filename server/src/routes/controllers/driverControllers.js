const axios = require('axios');
const { Driver , Team } = require("../../db");
const notFoundImage = "https://i.imgur.com/OGzwjjt.jpeg"

let allDrivers = []

const getAllDrivers = async (name) => {
    const allDriversDb = await Driver.findAll({
         include: {
             model: Team,
             attributes: ['name'],
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
            image: driver.image.url || notFoundImage,
            nationality: driver.nationality,
            dob: driver.dob,
            teams: driver.teams,
  
        };
    })
    
    allDrivers = [...allDriversApi, ...allDriversDb];

    if (name) {
        driversByName = allDrivers.filter((driver) => 
        driver.forename.toLowerCase().startsWith(name.toLowerCase()));
        if (driversByName.length) {
            return driversByName.slice(0, 15);
        } else {
            throw new Error(`No se encontro por el nombre: ${name}`);
        }
    } 
    
    return allDrivers
}

const getDriverById = async (id) => {
    let driverById;

    if (isNaN(id)) {
        driverById = await Driver.findByPk(id, { include: Team });
        if (!driverById) { 
            throw new Error(`Conductor con id: ${id} no encontrado en la base de datos`);
        }
    } else {
        try {
            const response = await axios.get(`http://localhost:5000/drivers/${id}`);
            driverById = response.data;
        } catch (error) { 
            throw new Error(`Conductor con id: ${id} no encontrado en la API`);
        }
    }

    return driverById;
}

const createDriver = async (forename, surname, description, image, nationality, dob, arrTeams) => {
  console.log(forename, surname, description, image, nationality, dob, arrTeams);
  const existingDriver = await Driver.findOne({
    where: {
      forename,
      surname,
    },
  });

  if (existingDriver) {
    const error = new Error('El piloto ya existe');
    error.status = 409;
    throw error;
  }

  const team = await Promise.all(
    arrTeams.map(async (teamName) => {
      const [result] = await Team.findOrCreate({
        where: { name: teamName },
      });
      return result.id;
    })
  );

  const newDriver = await Driver.create({
    forename,
    surname,
    description,
    image,
    nationality,
    dob,
  });

  await newDriver.addTeams(team);

    return newDriver;
}

const updateDriver = async (id, updateData) => {
  const { Teams, ...driverData } = updateData; 
  const driver = await Driver.findByPk(id);

  if (!driver) {
    throw new Error("Conductor no encontrado con el ID");
  }

  await driver.update(driverData);
  await driver.setTeams([]); 

  if (Teams && Teams.length > 0) { 
    for (const teamData of Teams) { 
      const { name } = teamData.DriverTeam;

      if (name) {
        let [team] = await Team.findOrCreate({ 
          where: { name },
          defaults: { name }
        });

        await driver.addTeam(team); 
      }
    }
  }
};

const deleteDriver = async (id) => {
  console.log(id);
  const driverToDelete = await Driver.findByPk(id);

  if (!driverToDelete) {
    throw new Error("Conductor no encontrado");
  }

  await driverToDelete.destroy();
  return driverToDelete;
};

module.exports = {
createDriver,
getAllDrivers,
getDriverById,
updateDriver,
deleteDriver,
}