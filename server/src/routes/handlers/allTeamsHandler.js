const  getAllTeams = require("../controllers/getAllTeams");

const allTeamsHandler = async (req, res)=>{ //req y res son objetos que representan la solicitud y respuesta HTTP
    try { //manejar errores
        const allTeams = await getAllTeams(); //llama a la funcion, espera el resultado y lo asigna
        res.status(200).json(allTeams); //codigo de estado que contiene la matriz devuelta por la funcion 
    } catch (error) { //si hay error...
        res.status(400).json({error: error.message});
    }
}
//exporta la ruta
module.exports = allTeamsHandler
