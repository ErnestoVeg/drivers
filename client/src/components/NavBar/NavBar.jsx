import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

function NavBar({ handleOrder, selectedOrder, selectedTeam, selectedOrigin, teams, handlerFilterTeam, resetHandler, handlerFilterOrigin, onSearch }) {
  const [resetSelectOrder, setResetSelectOrder] = useState(false);
  const [isChecked, setIsChecked] = useState(localStorage.getItem("checkedSearch") === "true"); 

  useEffect(() => {
    setResetSelectOrder(false);
  }, [resetHandler]);

  const handleReset = () => {
    setIsChecked(false); // Reiniciamos 
    localStorage.setItem("checkedSearch", false); // Actualizamos
    setResetSelectOrder(true);
    resetHandler();
  };

  const handleCheckboxChange = () => {
    const updatedValue = !isChecked;
    setIsChecked(updatedValue);
    localStorage.setItem("checkedSearch", updatedValue); // Actualizamos 
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

      {/* SELECT DE ORDENAMIENTO */}
      <select onChange={handleOrder} value={selectedOrder} className={styles.select} title='It may be sorted Ascending or Descending by forename, in addition to being able to sort by dob'>
        <option value="">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
        <option value="nacA">Dob(Asc)</option>
        <option value="nacD">Dob(Desc)</option>
      </select>

      {/* SELECT DE FILTROS X TEAM */}
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

      {/* SELECT DE FILTROS API|DB|ALL  */}
      <select onChange={handlerFilterOrigin} value={selectedOrigin} className={styles.selectOrigin} title='You can filter according to the origin of the data, if they come from the DB or from the API.'>
        <option value="all">ALL</option>
        <option value="api">API</option>
        <option value="db">DB</option>
      </select>
    </div>
  );
}

export default NavBar;