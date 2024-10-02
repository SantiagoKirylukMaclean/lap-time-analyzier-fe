import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMappingContext } from '../context/MappingContext';
import * as pdfjsLib from 'pdfjs-dist';

// Definir las columnas estándar según tu sistema
const standardColumns = [
  'NUMBER', 'DRIVER_NUMBER', 'LAP_NUMBER', 'LAP_TIME', 'LAP_IMPROVEMENT', 
  'CROSSING_FINISH_LINE_IN_PIT', 'S1', 'S1_IMPROVEMENT', 'S2', 'S2_IMPROVEMENT', 
  'S3', 'S3_IMPROVEMENT', 'KPH', 'ELAPSED', 'HOUR', 'S1_LARGE', 'S2_LARGE', 
  'S3_LARGE', 'TOP_SPEED', 'DRIVER_NAME', 'PIT_TIME', 'CLASS', 'GROUP', 
  'TEAM', 'MANUFACTURER', 'FLAG_AT_FL', 'S1_SECONDS', 'S2_SECONDS', 'S3_SECONDS'
];

const MappingPage: React.FC = () => {
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [fileData, setFileData] = useState<any[]>([]); // Guardar el contenido del archivo completo
  const [mapping, setMapping] = useState<{ [key: string]: string | null }>({});
  const { setMappedData } = useMappingContext(); // Usar el contexto para guardar el mapeo
  const navigate = useNavigate(); // Usar la navegación de React Router

  // Procesar archivos PDF
  const extractPdfData = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
      const pdf = await pdfjsLib.getDocument(typedarray).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        textContent.items.forEach((item: any) => {
          fullText += (item.str || '') + ' ';
        });
      }

      // Procesar el texto del PDF
      const allLines = fullText.split(/\r\n|\n/);
      const firstLine = allLines[0];
      
      // Asumir un delimitador en el contenido del PDF
      const headers = firstLine.split(/\s+/).map((header: string) => header.trim());
      setFileColumns(headers); // Actualizar las columnas del archivo PDF

      // Leer los datos del archivo PDF
      const data = allLines.slice(1).map(line => line.split(/\s+/));
      setFileData(data); // Guardar los datos del archivo PDF
    };

    reader.readAsArrayBuffer(file);
  };

  // Procesar archivos CSV
  const extractCsvData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const allLines = text.split(/\r\n|\n/);
      const firstLine = allLines[0];
      
      // Detectar si el archivo está separado por comas o punto y coma
      const isCommaSeparated = firstLine.includes(',');
      const headers = isCommaSeparated
        ? firstLine.split(',').map((header: string) => header.trim())
        : firstLine.split(';').map((header: string) => header.trim());

      setFileColumns(headers); // Actualiza las columnas del archivo CSV

      // Leer los datos del archivo CSV
      const data = allLines.slice(1).map(line => 
        isCommaSeparated ? line.split(',') : line.split(';')
      );
      setFileData(data); // Almacenar los datos del archivo CSV
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'application/pdf') {
        // Procesar PDF
        extractPdfData(file);
      } else if (fileType === 'text/csv') {
        // Procesar CSV
        extractCsvData(file);
      } else {
        alert('Formato de archivo no compatible. Solo se aceptan archivos PDF o CSV.');
      }
    }
  };

  useEffect(() => {
    if (fileColumns.length > 0) {
      const autoMapping: { [key: string]: string | null } = {};
      fileColumns.forEach((fileCol) => {
        const matchedColumn = standardColumns.find((stdCol) => stdCol.toLowerCase() === fileCol.toLowerCase());
        autoMapping[fileCol] = matchedColumn || null;
      });
      setMapping(autoMapping);
    }
  }, [fileColumns]);

  const handleMappingChange = (fileColumn: string, standardColumn: string) => {
    setMapping({ ...mapping, [fileColumn]: standardColumn || null });
  };

  const handleFinalize = () => {
    // Procesar los datos y aplicar el mapeo
    const mappedData = fileData.map(row => {
      const mappedRow: { [key: string]: string } = {};
      fileColumns.forEach((fileCol, index) => {
        const mappedCol = mapping[fileCol] || fileCol;
        mappedRow[mappedCol] = row[index];
      });
      return mappedRow;
    });

    setMappedData(mappedData); // Guardar el resultado en el contexto
    navigate('/result'); // Navegar a la página de resultados
  };

  return (
    <div>
      <h1>Subir Archivo y Mapear Columnas</h1>
      
      <input type="file" accept=".csv, .pdf" onChange={handleFileUpload} />

      {fileColumns.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Columna del archivo</th>
                <th>Columna estándar</th>
              </tr>
            </thead>
            <tbody>
              {fileColumns.map((fileCol, index) => (
                <tr key={index}>
                  <td>{fileCol}</td>
                  <td>
                    <select 
                      value={mapping[fileCol] || ''} 
                      onChange={(e) => handleMappingChange(fileCol, e.target.value)}
                    >
                      <option value="">Selecciona una columna</option>
                      {standardColumns.map((stdCol, i) => (
                        <option key={i} value={stdCol}>{stdCol}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleFinalize}>Finalizar</button>
        </>
      )}
    </div>
  );
};

export default MappingPage;
