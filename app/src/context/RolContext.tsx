import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'barbero' | 'cliente';

interface RolContextValue {
  rol: UserRole;
  setRol: (rol: UserRole) => void;
}

const RolContext = createContext<RolContextValue>({
  rol: 'barbero',
  setRol: () => {},
});

export function RolProvider({ children }: { children: React.ReactNode }) {
  const [rol, setRol] = useState<UserRole>('barbero');
  return (
    <RolContext.Provider value={{ rol, setRol }}>
      {children}
    </RolContext.Provider>
  );
}

export function useRol(): RolContextValue {
  return useContext(RolContext);
}
