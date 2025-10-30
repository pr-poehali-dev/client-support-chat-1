import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Здравствуйте! Чем могу помочь?',
      sender: 'operator',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Headphones" size={28} />
              <div>
                <h1 className="text-2xl font-bold">Поддержка</h1>
                <p className="text-blue-100 text-sm">Мы онлайн и готовы помочь</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEmployeeLogin}
              className="text-white hover:bg-white/20"
            >
              <Icon name="UserCog" size={18} className="mr-2" />
              Вход для сотрудников
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96 p-6 bg-white">
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
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

        <div className="p-4 bg-gray-50 rounded-b-lg border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Напишите сообщение..."
              className="flex-1"
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
              <Icon name="Send" size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientChat;
