import { createContext } from "react";
import { useState, useContext } from "react";

export const MainContext = createContext();

const Provider = ({ children }) => {
  const [collections, setCollections] = useState([]);

  return (
    <MainContext.Provider value={{ collections, setCollections }}>
      {children}
    </MainContext.Provider>
  );
};

export const useCtx = () => {
  return useContext(MainContext);
};

export default Provider;
