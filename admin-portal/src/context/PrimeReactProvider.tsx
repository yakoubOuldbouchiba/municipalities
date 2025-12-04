import React, { ReactNode, createContext, useContext, useCallback } from 'react';

interface ContextState {
  hideOverlaysOnDocumentScrolling: (value: boolean) => void;
}

const PrimeReactContext = createContext<ContextState | undefined>(undefined);

export const usePrimeReactContext = () => {
  const context = useContext(PrimeReactContext);
  if (!context) {
    return {
      hideOverlaysOnDocumentScrolling: (value: boolean) => {}
    };
  }
  return context;
};

interface PrimeReactProviderProps {
  children: ReactNode;
}

export const PrimeReactProvider: React.FC<PrimeReactProviderProps> = ({ children }) => {
  const hideOverlaysOnDocumentScrolling = useCallback((value: boolean) => {
    // This function can be used to control overlay behavior
  }, []);

  return (
    <PrimeReactContext.Provider
      value={{
        hideOverlaysOnDocumentScrolling
      }}
    >
      {children}
    </PrimeReactContext.Provider>
  );
};
