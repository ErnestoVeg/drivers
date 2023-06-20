import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDrivers,
  orderDrivers,
  getTeams,
  filterTeams,
  reset,
  filterOrigin,
  searchDrivers,
} from "../../redux/actions";
import Paginado from "../../components/Paginado/Paginado";
import CardList from "../../components/CardList/CardList";
import Navbar from "../../components/NavBar/NavBar";
import styles from "./home.module.css";

function Home() {
  const dispatch = useDispatch();
  const filteredDrivers = useSelector((state) => state.filteredDrivers);
  const teams = useSelector((state) => state.teams);
  const error = useSelector((state) => state.error);

  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const driversPerPage = 9;
  const indexLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexLastDriver - driversPerPage;

  const [selectedOrder, setSelectedOrder] = useState(
    localStorage.getItem("selectedOrder") || ""
  );
  const [selectedTeam, setSelectedTeam] = useState(
    localStorage.getItem("selectedTeam") || ""
  );
  const [selectedOrigin, setSelectedOrigin] = useState(
    localStorage.getItem("selectedOrigin") || ""
  );
  const [checkedSearch, setCheckedSearch] = useState(
    localStorage.getItem("checkedSearch") === "true"
  );

  useEffect(() => {
    setTimeout(() => {
      dispatch(setError(""));
    }, 10000);
  }, [dispatch, error])

  useEffect(() => {
    if (!filteredDrivers.length) {
      dispatch(getDrivers());
    }
  }, [dispatch, filteredDrivers]);

  useEffect(() => {
    if (!teams.length) {
      dispatch(getTeams());
    }
  }, [dispatch, teams]);

  useEffect(() => {
    const storedCurrentPage = localStorage.getItem("currentPage");
    if (storedCurrentPage) {
      setCurrentPage(parseInt(storedCurrentPage));
      localStorage.removeItem("currentPage");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOrder = (event) => {
    const orderType = event.target.value;
    setSelectedOrder(orderType);
    localStorage.setItem("selectedOrder", orderType);
    dispatch(orderDrivers(orderType));
  };

  const handlerFilterTeam = (event) => {
    const team = event.target.value;
    setSelectedTeam(team);
    localStorage.setItem("selectedTeam", team);
    dispatch(filterTeams(team));
  };

  const handleSearch = (name, isChecked) => {
    setCheckedSearch(isChecked);
    localStorage.setItem("checkedSearch", isChecked.toString());
    dispatch(searchDrivers(name, isChecked));
  };

  const resetHandler = () => {
    setCurrentPage(1);
    setSelectedOrder("");
    setSelectedTeam("");
    setSelectedOrigin("");
    setCheckedSearch(false);
    localStorage.removeItem("selectedOrder");
    localStorage.removeItem("selectedTeam");
    localStorage.removeItem("selectedOrigin");
    localStorage.removeItem("checkedSearch");
    dispatch(reset());
  };

  const handlerFilterOrigin = (event) => {
    const origin = event.target.value;
    setSelectedOrigin(origin);
    localStorage.setItem("selectedOrigin", origin);
    dispatch(filterOrigin(origin));
  };

  return (
    <div className={styles.home}>
      <div className={styles.navBar}>
        <Navbar
          onSearch={handleSearch}
          handleOrder={handleOrder}
          teams={teams}
          handlerFilterTeam={handlerFilterTeam}
          resetHandler={resetHandler}
          handlerFilterOrigin={handlerFilterOrigin}
          selectedOrder={selectedOrder}
          selectedTeam={selectedTeam}
          selectedOrigin={selectedOrigin}
          checkedSearch={checkedSearch}
        />
        {error && <p className={styles.errores}>{error}</p>}
      </div>
      
      <div className={styles.paginadoContainer}>
        <Paginado
          driversPerPage={driversPerPage}
          allDrivers={filteredDrivers.length}
          paginado={paginado}
          currentPage={currentPage}
        />
      </div>
      <CardList drivers={filteredDrivers.slice(indexOfFirstDriver, indexLastDriver)} />
    </div>
  );
}

export default Home;