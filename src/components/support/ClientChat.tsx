import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import RatingModal from './RatingModal';

interface Message {
  id: number;
  text: string;
  sender: 'client' | 'operator';
  timestamp: Date;
}

interface ClientChatProps {
  onEmployeeLogin: () => void;
}

const ClientChat = ({ onEmployeeLogin }: ClientChatProps) => {
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Чем могу помочь?',
      sender: 'operator',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);

  useEffect(() => {
    const checkForRatingRequest = () => {
      const ratings = JSON.parse(localStorage.getItem('chatRatings') || '[]');
      const pendingRating = ratings.find((r: any) => 
        r.clientPhone === phone && r.awaitingRating
      );
      
      if (pendingRating && isRegistered) {
        setShowRating(true);
        setChatId(pendingRating.chatId);
      }
    };

    const interval = setInterval(checkForRatingRequest, 2000);
    return () => clearInterval(interval);
  }, [phone, isRegistered]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      setIsRegistered(true);
      toast({
        title: 'Добро пожаловать!',
        description: 'Оператор свяжется с вами в ближайшее время',
      });
    }
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'client',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleRatingSubmit = (rating: number) => {
    const ratings = JSON.parse(localStorage.getItem('chatRatings') || '[]');
    const updatedRatings = ratings.map((r: any) => 
      r.chatId === chatId 
        ? { ...r, rating, awaitingRating: false, ratedAt: new Date().toISOString() }
        : r
    );
    localStorage.setItem('chatRatings', JSON.stringify(updatedRatings));
    setShowRating(false);
    toast({
      title: 'Спасибо!',
      description: 'Ваша оценка поможет нам стать лучше',
    });
  };

  const handleRatingSkip = () => {
    const ratings = JSON.parse(localStorage.getItem('chatRatings') || '[]');
    const updatedRatings = ratings.map((r: any) => 
      r.chatId === chatId 
        ? { ...r, awaitingRating: false, skipped: true }
        : r
    );
    localStorage.setItem('chatRatings', JSON.stringify(updatedRatings));
    setShowRating(false);
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl bg-gray-800 border-purple-500/30">
          <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 rounded-t-lg">
            <div className="flex items-center gap-3 justify-center">
              <Icon name="Headphones" size={32} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Поддержка клиентов</h1>
                <p className="text-purple-100 text-sm">Мы готовы помочь вам</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleRegister} className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-200">Ваше имя</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите ваше имя"
                required
                autoFocus
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-200">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Начать чат
            </Button>
          </form>

          <div className="px-6 pb-6">
            <Button
              variant="ghost"
              onClick={onEmployeeLogin}
              className="w-full text-gray-400 hover:text-purple-400 hover:bg-gray-700/50"
            >
              <Icon name="UserCog" size={18} className="mr-2" />
              Вход для сотрудников
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl bg-gray-800 border-purple-500/30">
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Headphones" size={28} className="text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Поддержка</h1>
                <p className="text-purple-100 text-sm">Здравствуйте, {name}!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEmployeeLogin}
              className="text-white hover:bg-white/20"
            >
              <Icon name="UserCog" size={18} className="mr-2" />
              Для сотрудников
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96 p-6 bg-gray-900">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'client' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.sender === 'client'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 bg-gray-800 rounded-b-lg border-t border-gray-700">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Button onClick={sendMessage} className="bg-purple-600 hover:bg-purple-700">
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>
      </Card>
      
      {showRating && (
        <RatingModal 
          onSubmit={handleRatingSubmit}
          onSkip={handleRatingSkip}
        />
      )}
    </div>
  );
};

export default ClientChat;