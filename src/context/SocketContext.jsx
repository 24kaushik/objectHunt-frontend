import React, { createContext, useContext, useMemo } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => io(import.meta.env.VITE_HOST), [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => useContext(SocketContext);

export default SocketProvider
export { useSocket }