import React, { useState } from 'react';
import Dropzone from '../components/Dropzone';
import { useNavigate } from 'react-router-dom';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleFileUpload = (files: File[]) => {
    setFile(files[0]);
    // Lógica para manejar el archivo aquí
    navigate('/mapping');
  };

  return (
    <div>
      <h1>Subir Archivo</h1>
      <Dropzone onFileUpload={handleFileUpload} />
      {file && <p>Archivo subido: {file.name}</p>}
    </div>
  );
};

export default UploadPage;
