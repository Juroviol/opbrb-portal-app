import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import User from '../models/User.ts';

const AuthContext = createContext<{
  user: User | null;
  setUser: (user: User) => void;
}>({
  user: null,
  setUser: () => false,
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const providerValue = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
