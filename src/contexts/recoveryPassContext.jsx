import React, { createContext, useState } from 'react';

// Create the context
export const RecoveryData = createContext();

// Create a provider component
export const MyRecoveryDataProvider = ({ children }) => {
  const [value, setValue] = useState({}); // Set the initial value

  return (
    <RecoveryData.Provider value={{ value, setValue }}>
      {children}
    </RecoveryData.Provider>
  );
};