import React from 'react';
import { useMappingContext } from '../context/MappingContext';
import './ResultPage.css'; // Importar el archivo CSS

const ResultPage: React.FC = () => {
  const { mappedData } = useMappingContext();

  return (
    <div>
      <h1>Resultado del Mapeo</h1>
      {mappedData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(mappedData[0]).map((col, index) => (
                <th key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mappedData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((val, i) => (
                  <td key={i}>{String(val)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos disponibles</p>
      )}
    </div>
  );
};

export default ResultPage;
