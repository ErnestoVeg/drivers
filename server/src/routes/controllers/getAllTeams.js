const { Team } = require('../../db');
const axios = require('axios');

const getAllTeams = async () => { 
  const allTeamsDb = await Team.findAll(); // recuperar todos los equipos de la base de datos local 
  
  if (!allTeamsDb.length) { //si es un amatriz vacia... (no se encontraron teams en la bd)ejecuta el bloque 
    try { 
      const response = await axios.get('http://localhost:5000/drivers'); //solicitud get suponiendo que hay un extremo de la API que devuelve ese controlador
      const drivers = response.data; //si lo hay, recupera los datos del controlador r.data
   
      const driverTeams = drivers
      .map(driver => driver.teams) //extraemos los equipos de cada piloto y la propiedd de cada objeto driver
      .filter(teams => teams !== undefined) //eliminar cualquier undefined team
      .reduce((acc, teams) => {
        const splitTeams = teams.split(',').map(team => team.trim());
        return [...acc, ...splitTeams];
      }, []) //equipos extraidos se transforman en una matriz de nombres de equipo unico (recorta cada nombre) y los usa reduce para acumular los nombres
      .filter((team, index, arr) => arr.indexOf(team) === index);
      //nombres de equipo unico se usan para crear la matriz de objeto name
      const teamObjects = driverTeams.map(name => ({ name })); 
      await Team.bulkCreate(teamObjects); //inserta todos los objetos de equipo en la bd
      return driverTeams.sort();//matriz ordenada
      //error
    } catch (error) {
      console.error('Problemas con la API:', error);
    }
  } else {
    //no es una matriz vacia 
    const driverTeams = allTeamsDb //recupera los nombres de los equipos de esta matriz asignando cada objeto 
    .map(driver => driver.name) //asignando cada objeto del equipo y extrayendo el name 
    return driverTeams.sort(); //matriz de nombres de equipo 
  }

  
}

module.exports = getAllTeams;