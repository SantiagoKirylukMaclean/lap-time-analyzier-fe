import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <img src="/logo.svg" alt="Lap Time" className="logo" />
      <nav>
        <ol>
          <li><Link to="/">Subir Archivo</Link></li>
          <li><Link to="/mapping">Mapear Columnas</Link></li>
          <li><Link to="/result">Resultados</Link></li>
        </ol>
      </nav>
    </header>
  );
};

export default Header;
