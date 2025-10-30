import { useState, useEffect } from 'react';
import ClientChat from '@/components/support/ClientChat';
import LoginPage from '@/components/support/LoginPage';
import OperatorDashboard from '@/components/support/OperatorDashboard';
import AdminDashboard from '@/components/support/AdminDashboard';

interface User {
  login: string;
  password: string;
  role: 'admin' | 'operator';
}

const USERS: User[] = [
  { login: '123', password: '803254', role: 'admin' },
  { login: 'operator1', password: 'pass123', role: 'operator' },
  { login: 'operator2', password: 'pass456', role: 'operator' },
];

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('support_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (login: string, password: string): boolean => {
    const foundUser = USERS.find(u => u.login === login && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('support_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('support_user');
    setShowLogin(false);
  };

  const handleEmployeeLogin = () => {
    setShowLogin(true);
  };

  const handleBackToClient = () => {
    setShowLogin(false);
  };

  if (showLogin && !user) {
    return <LoginPage onLogin={handleLogin} onBack={handleBackToClient} />;
  }

  if (user) {
    if (user.role === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else {
      return <OperatorDashboard user={user} onLogout={handleLogout} />;
    }
  }

  return <ClientChat onEmployeeLogin={handleEmployeeLogin} />;
};

export default Index;
