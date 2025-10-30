import { useState } from 'react';
import ClientChat from '@/components/support/ClientChat';
import LoginPage from '@/components/support/LoginPage';
import OperatorDashboard from '@/components/support/OperatorDashboard';
import AdminDashboard from '@/components/support/AdminDashboard';

type UserRole = 'client' | 'operator' | 'admin' | null;

interface User {
  login: string;
  role: UserRole;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (login: string, password: string) => {
    if (login === '123' && password === '803254') {
      setUser({ login: '123', role: 'admin' });
      return true;
    }
    
    if (login && password) {
      setUser({ login, role: 'operator' });
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <ClientChat onEmployeeLogin={() => setUser({ login: '', role: null })} />;
  }

  if (user.role === null) {
    return <LoginPage onLogin={handleLogin} onBack={() => setUser(null)} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return <OperatorDashboard user={user} onLogout={handleLogout} />;
};

export default Index;
