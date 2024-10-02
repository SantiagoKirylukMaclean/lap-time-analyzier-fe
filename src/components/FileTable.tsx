import React from 'react';

interface FileTableProps {
  columns: string[];
  rows: any[]; // Ajustar de acuerdo al tipo de los datos
}

const FileTable: React.FC<FileTableProps> = ({ columns, rows }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, index) => <th key={index}>{col}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>{row[col] || 'N/A'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FileTable;
