import Cards from "../Card/Card";
import styles from "./CardList.module.css";

function CardList({drivers}) {
  const arrDrivers = drivers

  return (
    <div className={styles.card_list}>
      {arrDrivers?.map((driver, index) => (<Cards key={index} driver={driver} />))} 
    </div>
  );
}
//iterar arrD para cada objeto del controlador cards (driver, index)
//Cada componente renderizado Cardsrepresenta una tarjeta para un controlador específico.
export default CardList;