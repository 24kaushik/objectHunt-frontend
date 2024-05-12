import React, { createContext, useContext, useState } from 'react';

const ErrorContext = createContext();

const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("")

  return (
    <ErrorContext.Provider value={{error, setError}}>
      {children}
    </ErrorContext.Provider>
  );
};

const useError = () => useContext(ErrorContext);

export default ErrorProvider
export { useError }