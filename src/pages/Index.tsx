import { useState, useEffect } from 'react';
import { ClientChat } from '@/components/ClientChat';
import { LoginForm } from '@/components/LoginForm';
import { EmployeeDashboard } from '@/components/EmployeeDashboard';

const Index = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('support_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('support_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('support_user');
  };

  const queryParams = new URLSearchParams(window.location.search);
  const isEmployee = queryParams.get('mode') === 'employee';

  if (isEmployee) {
    if (!user) {
      return <LoginForm onLogin={handleLogin} />;
    }
    return <EmployeeDashboard user={user} onLogout={handleLogout} />;
  }

  return <ClientChat />;
};

export default Index;
