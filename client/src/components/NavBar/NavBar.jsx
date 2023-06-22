import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar({ 
  handleOrder, //manejar la seleccion de pedidos
  selectedOrder, //el valor del pedido actualmente seleccionado 
  selectedTeam, //el valor del equipo actualmente seleccionado.
  selectedOrigin, //el valor de origen actualmente seleccionado.
  teams, //una matriz de equipos para filtrar.
  handlerFilterTeam, //función para manejar la selección del filtro del equipo.
  resetHandler, //función para manejar la acción de reinicio.
  handlerFilterOrigin, // función para manejar la selección del filtro de origen.
  onSearch //función para manejar la acción de búsqueda.
}) {
  const [resetSelectOrder, setResetSelectOrder] = useState(false);
  const [isChecked, setIsChecked] = useState(localStorage.getItem("checkedSearch") === "true"); 

  useEffect(() => { //restablecer cuando el estado cuando resetSelectOrder cambia de accesorio
    setResetSelectOrder(false);
  }, [resetHandler]);

  const handleReset = () => { //se llama cuando hacemos click en reset
    setIsChecked(false); // Reiniciamos 
    localStorage.setItem("checkedSearch", false); // Actualiza el estado de la casilla de verificacion y borra localstorage
    setResetSelectOrder(true);
    resetHandler();
  };

  const handleCheckboxChange = () => {//cuando se activa la casilla de verificacion 
    const updatedValue = !isChecked;
    setIsChecked(updatedValue);// Actualiza el iCheck estado 
    localStorage.setItem("checkedSearch", updatedValue); //almacena el valor actualizado de forma local
  };

  return (
    <div className={styles.container} >
      
      <NavLink to="/create" className={styles.buttonNew}>
        New Driver
      </NavLink>
      
      <label className={styles.labelraya}> | </label>
      <div className={styles.searchContainer}>
        <SearchBar onSearch={onSearch} isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} /> {/* Pasamos el estado del checkbox y la función de cambio como props */}
      </div>

      <button className={styles.buttonLink} onClick={handleReset} title='All filters and sorts will be initialized, showing all drivers.'>
        Reset
      </button>

      <select onChange={handleOrder} value={selectedOrder} className={styles.select} title='It may be sorted Ascending or Descending by forename, in addition to being able to sort by dob'>
        <option value="">Order</option>
        <option value="asc">Ascendente</option>
        <option value="desc">Descendiente</option>
        <option value="nacA">Dob(Asc)</option>
        <option value="nacD">Dob(Desc)</option>
      </select>

      <select onChange={handlerFilterTeam} value={selectedTeam} className={styles.selectTeam} title='You can filter the drivers according to the team they belong to.'>
        <option value="">Team</option>
        {teams &&
          teams.map((team) => {
            return (
              <option key={team} value={team}>
                {team}
              </option>
            );
          })}
      </select>

      <select onChange={handlerFilterOrigin} value={selectedOrigin} className={styles.selectOrigin} title='You can filter according to the origin of the data, if they come from the DB or from the API.'>
        <option value="all">ALL</option>
        <option value="api">API</option>
        <option value="db">DB</option>
      </select>
    </div>
  );
}

export default NavBar;