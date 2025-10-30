import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (login: string, password: string) => boolean;
  onBack: () => void;
}

const LoginPage = ({ onLogin, onBack }: LoginPageProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onLogin(login, password)) {
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать!',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Icon name="ShieldCheck" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Вход для сотрудников</h1>
          <p className="text-gray-600">Введите ваши учетные данные</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
            <Icon name="LogIn" size={18} className="mr-2" />
            Войти
          </Button>
        </form>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Вернуться к чату
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
