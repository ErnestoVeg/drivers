import { GET_DRIVERS, ORDER, GET_TEAMS, FILTER_TEAMS,RESET, FILTER_ORIGIN, SEARCH_DRIVERS, SET_ERROR, GET_DRIVERS_BY_NAME } from './actions'
//trabajadores
const initialState = {//estado inicial 
    allDrivers: [], //todos los controladores 
    filteredDrivers: [], //filtrados
    teams: [], //matriz de equipos
    error:null, //obj error
  };
  
const reducer = (state = initialState, action) => {
  switch (action.type) {//declaracion de cambio para manejar las acciones
    case GET_DRIVERS: //el estado se actualiza con las propiedades...
      return {
        ...state,
        allDrivers: action.payload,
        filteredDrivers: action.payload.map(driver => ({...driver})),
      };

    case GET_DRIVERS_BY_NAME:
        return {
          ...state,
          allUsers: action.payload,
        };

    case ORDER:
      const orderType = action.payload;
      let sortedDrivers = [...state.filteredDrivers]
      if (orderType === "asc") { //acendente
        sortedDrivers.sort((a,b) => a.forename.localeCompare(b.forename))
      } else if (orderType === "desc") { //desendente
        sortedDrivers.sort((a,b) => b.forename.localeCompare(a.forename))
      } else if (orderType === "nacA") { //reciente
        sortedDrivers.sort((a, b) => {
          const dateA = new Date(a.dob);
          const dateB = new Date(b.dob);
          return dateA - dateB;
        })
      } else if (orderType === "nacD") { //antigua
        sortedDrivers.sort((a, b) => {
          const dateA = new Date(a.dob);
          const dateB = new Date(b.dob);
          return dateB - dateA;
        })
      }
      return {
        ...state,
        filteredDrivers: sortedDrivers
      }

    case GET_TEAMS: //actualiza la propiedad teams en el estado con los datos de la carga 
      return {
        ...state,
        teams: action.payload
      }

    case FILTER_TEAMS:
      const team = action.payload;
      const filteredTeam = state.filteredDrivers.filter((t) => { //en funcion del team valor
        const teamsArray = t.teams && t.teams.split(",").map((team) => team.trim()); //comprueba que cada piloto tiene el equipo seleccionado en su team matriz
        return teamsArray && teamsArray.includes(team); //pilotos filtrados
      });
      if (!filteredTeam || filteredTeam.length === 0) {
        throw new Error("Not drivers with this team, please press RESET");
      }
      return {
        ...state,
        filteredDrivers: filteredTeam
      } 

    case RESET: //restablece la matriz fDrivers copiando todos los controladores en allDri
      return {
        ...state,
        filteredDrivers: [...state.allDrivers]
      }
          
    case FILTER_ORIGIN:
      const origin = action.payload;
      let filterxorigin = [...state.filteredDrivers];//filtra la fD en funcion del origin 
          
      if (origin === "api") {
        filterxorigin = state.filteredDrivers.filter((driver) => !('createInDb' in driver));
      } else if (origin === "db") {
        filterxorigin = state.filteredDrivers.filter((driver) => 'createInDb' in driver);
      } //filtra los controladores en función de si se crearon a partir de la API o de la base de datos.
          
      if (!filterxorigin || filterxorigin.length === 0) {
        throw new Error("No drivers with this filter");
      }
          
      return {
        ...state,
        filteredDrivers: filterxorigin
      }

    case SEARCH_DRIVERS:
      const isChecked = action.payload.isChecked;
      const name = action.payload.name; //busqueda de controladores en funcion del name 

      let searchResult = []
      if (isChecked === "all") { //determinamos si la busqueda se realiza en todos los controladores (ischequed = todos)
        searchResult = state.allDrivers.filter((driver) => {
        return driver.forename.toLowerCase().startsWith(name.toLowerCase());
        })
         
      } else {
        searchResult = state.filteredDrivers.filter((driver) => { //o solo en los controladores filtrados 
          return driver.forename.toLowerCase().startsWith(name.toLowerCase());
        }) 
      }

      if (searchResult.length === 0) {
          
        return {
          ...state,
          filteredDrivers: [],
          error: 'No se encontraron resultados para la búsqueda.',
        };
      }
          
      return {
        ...state,
        filteredDrivers: searchResult,
      };
    
    case SET_ERROR: //actualiza errores
      return {
        ...state,
        error: action.payload,
      };
    
    default: //si nada de esto ocurre regresa el estado actual 
      return state;
  }
};


  
  export default reducer;