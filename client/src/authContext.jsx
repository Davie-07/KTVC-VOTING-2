import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadToken, setAuthToken } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'student' | 'admin'

  useEffect(() => {
    const t = loadToken();
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const value = useMemo(() => ({ token, setToken, role, setRole }), [token, role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


