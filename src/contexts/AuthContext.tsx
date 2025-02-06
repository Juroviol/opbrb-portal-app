import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import User from '../models/User.ts';
import { useLazyQuery } from '@apollo/client';
import { GET_LOGGED_USER } from '../querys/userQuery.ts';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext<{
  user: User | null;
  handleLoginData: () => void;
}>({
  user: null,
  handleLoginData: () => false,
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

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      handleLoginData();
    }
  }, []);

  const providerValue = useMemo(() => {
    return {
      user,
      handleLoginData,
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
