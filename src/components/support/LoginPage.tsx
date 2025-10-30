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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl bg-gray-800 border-purple-500/30">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Icon name="ShieldCheck" size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Вход для сотрудников</h1>
          <p className="text-gray-400">Введите ваши учетные данные</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="login" className="text-gray-200">Логин</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              autoFocus
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
          </div>

          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Icon name="LogIn" size={18} className="mr-2" />
            Войти
          </Button>
        </form>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full text-gray-400 hover:text-purple-400 hover:bg-gray-700/50"
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
