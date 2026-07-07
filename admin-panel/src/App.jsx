import { useEffect } from 'react';
import { AppRouter } from './app/router/AppRouter';
import { useAuth } from './hooks/useAuth';

// Ye component check karega ki agar token hai par user data nahi hai, toh use fetch karega
const AuthInitializer = () => {
  const { isAuthenticated, user, fetchUser } = useAuth();
  
  useEffect(() => {
    // Agar user authenticated hai (token hai) lekin user object null hai (refresh ke baad)
    if (isAuthenticated && !user) {
      fetchUser(); // Backend se /auth/me call karke user data lao
    }
  }, [isAuthenticated, user, fetchUser]);

  return null; // Ye kuch render nahi karega, bas background mein kaam karega
};

function App() {
  return (
    <>
      {/* Provider yahan NAHI hoga, kyunki wo main.jsx mein already hai */}
      <AuthInitializer /> 
      <AppRouter />
    </>
  );
}

export default App;
