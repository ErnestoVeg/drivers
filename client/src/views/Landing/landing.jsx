import { Link } from 'react-router-dom';
import React from 'react';
import styles from './landing.module.css';

const Landing = () => {
  return (
    <div>
      <div className={styles.linkContainer}>
        <h1>LOS MEJORES CORREDORES ESTAN AQUI</h1>
        <Link to="/home" className={styles.link}>
          ¡Arranquemos!
        </Link>
      </div>
    </div>
  );
};

export default Landing;