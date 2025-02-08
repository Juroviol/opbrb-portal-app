import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import User, { Scope } from '../models/User.ts';
import { useLazyQuery } from '@apollo/client';
import { GET_LOGGED_USER } from '../querys/userQuery.ts';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<{
  user: User | null;
  hasPermission: (scope: Scope) => boolean;
  handleLoginData: () => void;
  logout: () => void;
}>({
  user: null,
  handleLoginData: () => false,
  hasPermission: () => false,
  logout: () => false,
});

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [getLoggedUser] = useLazyQuery<{ getLoggedUser: User }>(
    GET_LOGGED_USER
  );

  const handleLoginData = useCallback(async () => {
    if (localStorage.getItem('accessToken')) {
      const { data } = await getLoggedUser();
      if (data?.getLoggedUser) {
        setUser(data?.getLoggedUser);
        navigate('/');
      }
    }
  }, []);

  const hasPermission = useCallback(
    (scope: Scope) => !!user?.scopes.includes(scope),
    [user]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  }, []);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      handleLoginData();
    }
  }, []);

  const providerValue = useMemo(() => {
    return {
      user,
      handleLoginData,
      hasPermission,
      logout,
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
