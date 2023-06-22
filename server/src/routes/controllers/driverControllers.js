const axios = require('axios');
const { Driver , Team } = require("../../db");
const notFoundImage = "https://i.imgur.com/OGzwjjt.jpeg"

let allDrivers = []
//obtiene informacion de la base de datos 
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
    //obtiene informacion de la api
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
    //combinacion de resultados
    //allDrivers = [...allDriversApi, ...allDriversDb];
    allDrivers.push(...allDriversApi, ...allDriversDb);

    if (name) {
        driversByName = allDrivers.filter((driver) => 
        driver.forename.toLowerCase().startsWith(name.toLowerCase()));
        if (driversByName.length) {
            return driversByName.slice(0, 15);
        } else {
            throw new Error(`No se encontro por el nombre: ${name}`);
        }
    } 
    // la función filtra los conductores por ese nombre y devuelve los primeros 15 conductores que coinciden.
    return allDrivers
}

const getDriverById = async (id) => {
    let driverById;
// recupera información de un conductor específico según su ID.
    if (isNaN(id)) {// función verifica si el ID es un número o no para determinar si debe buscar en la base de datos
        driverById = await Driver.findByPk(id, { include: Team }); //incluye información del equipo asociado al conductor
        if (!driverById) { //si id no es un numero busca al conductor en la db
            throw new Error(`Conductor con id: ${id} no encontrado en la base de datos`);
        }
    } else {
        try {
            const response = await axios.get(`http://localhost:5000/drivers/${id}`);
            driverById = response.data; //intenta recuperar informacion en una API externa 
        } catch (error) { 
            throw new Error(`Conductor con id: ${id} no encontrado en la API`);
        }
    }

    return driverById;
}

//función que crea un nuevo registro de conductor en una base de datos
const createDriver = async (forename, surname, description, image, nationality, dob, arrTeams) => {
  console.log(forename, surname, description, image, nationality, dob, arrTeams);//parametros
  const existingDriver = await Driver.findOne({ //verificar si ya existe un conductor con fsname
    where: {
      forename,
      surname,
    },
  });
//error si se encuentra
  if (existingDriver) {
    const error = new Error('El piloto ya existe');
    error.status = 409;
    throw error;
  }

  const team = await Promise.all(// realizar operaciones asincrónicas en paralelo para cada elemento del arreglo arrTeams
    arrTeams.map(async (teamName) => {
      const [result] = await Team.findOrCreate({ //se busca o crea un equipo en la base de datos
        where: { name: teamName },
      });
      return result.id; //extraemos el resultado de id y lo almacenamos.
    })
  );

  const newDriver = await Driver.create({ //registro del conductor con parametros
    forename,
    surname,
    description,
    image,
    nationality,
    dob,
  });

  await newDriver.addTeams(team); 
  //addT metodo utilizado para asociar los equipos al nuevo conductor creado con el arreglo team
    return newDriver;
}

const updateDriver = async (id, updateData) => { //id = id del driver y uD = obj contiene los datos actualizados del driver
  const { Teams, ...driverData } = updateData; //extraemos teams de uD (hace desestructuracion) alamcena las prop restantes de dD
  const driver = await Driver.findByPk(id); //buscamos ctrl con id asignado con Driver.fBP
// error
  if (!driver) {
    throw new Error("Conductor no encontrado con el ID");
  }

  //si se encuentra...
  await driver.update(driverData); //actualiza los datos del ctrlador
  await driver.setTeams([]); //borra las asociaciones de los drivers con los equipos

  if (Teams && Teams.length > 0) { //si existe y su longitud es mayor a 0... bucle para procesar los datos de cada equipo
    for (const teamData of Teams) { 
      const { name } = teamData.DriverTeam; //extraemos name

      if (name) { //si existe 
        let [team] = await Team.findOrCreate({ //busca un equipo con el mismo nombre utilizado 
          where: { name },
          defaults: { name }
        });

      //si no existe, crea un nuevo equipo con el nombre especificado(asocia al piloto con el equipo)
        await driver.addTeam(team); 
      }
    }
  }
};

const deleteDriver = async (id) => { //parametro id representa el id del controlador que se eliminara
  console.log(id);
  const driverToDelete = await Driver.findByPk(id); //buscamos id con el metodo D.fBP 

  if (!driverToDelete) { //si no existe (error)
    throw new Error("Conductor no encontrado");
  }
//si se encuentra lo elimina de la base de datos con el metodo destroy
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