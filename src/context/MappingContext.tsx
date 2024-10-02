import React, { createContext, useState, useContext } from 'react';

// Definir la estructura del contexto para almacenar el mapeo y los datos del archivo
interface MappingContextProps {
  mappedData: any[]; // Los datos mapeados
  setMappedData: (data: any[]) => void;
}

const MappingContext = createContext<MappingContextProps>({
  mappedData: [],
  setMappedData: () => {},
});

export const useMappingContext = () => useContext(MappingContext);

export const MappingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mappedData, setMappedData] = useState<any[]>([]);

  return (
    <MappingContext.Provider value={{ mappedData, setMappedData }}>
      {children}
    </MappingContext.Provider>
  );
};
