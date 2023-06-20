import { GET_DRIVERS, ORDER, GET_TEAMS, FILTER_TEAMS,RESET, FILTER_ORIGIN, SEARCH_DRIVERS, SET_ERROR } from './actions'

const initialState = {
    allDrivers: [],
    filteredDrivers: [],
    teams: [],
    error:null,
  };
  
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DRIVERS:
      return {
        ...state,
        allDrivers: action.payload,
        filteredDrivers: action.payload.map(driver => ({...driver})),
      };

    case ORDER:
      const orderType = action.payload;
      let sortedDrivers = [...state.filteredDrivers]
      if (orderType === "asc") {
        sortedDrivers.sort((a,b) => a.forename.localeCompare(b.forename))
      } else if (orderType === "desc") {
        sortedDrivers.sort((a,b) => b.forename.localeCompare(a.forename))
      } else if (orderType === "nacA") {
        sortedDrivers.sort((a, b) => {
          const dateA = new Date(a.dob);
          const dateB = new Date(b.dob);
          return dateA - dateB;
        })
      } else if (orderType === "nacD") {
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

    case GET_TEAMS:
      return {
        ...state,
        teams: action.payload
      }

    case FILTER_TEAMS:
      const team = action.payload;
      const filteredTeam = state.filteredDrivers.filter((t) => {
        const teamsArray = t.teams && t.teams.split(",").map((team) => team.trim());
        return teamsArray && teamsArray.includes(team);
      });
      if (!filteredTeam || filteredTeam.length === 0) {
        throw new Error("Not drivers with this team, please press RESET");
      }
      return {
        ...state,
        filteredDrivers: filteredTeam
      } 

    case RESET:
      return {
        ...state,
        filteredDrivers: [...state.allDrivers]
      }
          
    case FILTER_ORIGIN:
      const origin = action.payload;
      let filterxorigin = [...state.filteredDrivers];
          
      if (origin === "api") {
        filterxorigin = state.filteredDrivers.filter((driver) => !('createInDb' in driver));
      } else if (origin === "db") {
        filterxorigin = state.filteredDrivers.filter((driver) => 'createInDb' in driver);
      } 
          
      if (!filterxorigin || filterxorigin.length === 0) {
        throw new Error("No drivers with this filter");
      }
          
      return {
        ...state,
        filteredDrivers: filterxorigin
      }

    case SEARCH_DRIVERS:
      const isChecked = action.payload.isChecked;
      const name = action.payload.name;

      let searchResult = []
      if (isChecked === "all") {
        searchResult = state.allDrivers.filter((driver) => {
        return driver.forename.toLowerCase().startsWith(name.toLowerCase());
        })
         
      } else {
        searchResult = state.filteredDrivers.filter((driver) => {
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
    
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    
    default:
      return state;
  }
};


  
  export default reducer;