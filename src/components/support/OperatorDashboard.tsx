import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface User {
  login: string;
  role: string;
}

interface OperatorDashboardProps {
  user: User;
  onLogout: () => void;
}

type OperatorStatus = 'online' | 'jira' | 'break' | 'offline';

const statusConfig = {
  online: { label: 'На линии', color: 'bg-green-500', icon: 'CheckCircle2' },
  jira: { label: 'Обработка Jira', color: 'bg-blue-500', icon: 'FileText' },
  break: { label: 'Отдых', color: 'bg-yellow-500', icon: 'Coffee' },
  offline: { label: 'Не в сети', color: 'bg-gray-500', icon: 'XCircle' },
};

interface ChatSession {
  id: number;
  clientName: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

const OperatorDashboard = ({ user, onLogout }: OperatorDashboardProps) => {
  const [status, setStatus] = useState<OperatorStatus>('online');
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const [chatSessions] = useState<ChatSession[]>([
    {
      id: 1,
      clientName: 'Клиент #1234',
      lastMessage: 'Здравствуйте! У меня вопрос по заказу',
      timestamp: new Date(),
      unread: 2,
    },
    {
      id: 2,
      clientName: 'Клиент #1235',
      lastMessage: 'Не могу войти в личный кабинет',
      timestamp: new Date(Date.now() - 300000),
      unread: 1,
    },
  ]);

  const currentStatus = statusConfig[status];

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-lg border-b border-purple-500/30">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Icon name="Headphones" size={28} className="text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Панель оператора</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Статус:</span>
              <Select value={status} onValueChange={(v) => setStatus(v as OperatorStatus)}>
                <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${currentStatus.color}`} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-white focus:bg-gray-600">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${config.color}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <Icon name="User" size={18} />
              <span className="font-medium">{user.login}</span>
            </div>

            <Button variant="outline" onClick={onLogout} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Icon name="LogOut" size={18} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-80 bg-gray-800 border-r border-gray-700">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold text-white mb-2">Активные диалоги</h2>
            <p className="text-sm text-gray-400">{chatSessions.length} диалогов</p>
          </div>

          <ScrollArea className="h-[calc(100%-100px)]">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 ${
                  activeChat === chat.id ? 'bg-purple-900/30' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="font-medium text-white">{chat.clientName}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-red-500">{chat.unread}</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {chat.timestamp.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 bg-gray-800 border-b border-gray-700">
                <h3 className="font-semibold text-white">
                  {chatSessions.find((c) => c.id === activeChat)?.clientName}
                </h3>
              </div>

              <ScrollArea className="flex-1 p-6 bg-gray-900">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-800 text-gray-100 shadow-sm border border-gray-700">
                      <p>Здравствуйте! У меня вопрос по заказу</p>
                      <p className="text-xs mt-1 text-gray-500">14:30</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-xs px-4 py-2 rounded-2xl bg-purple-600 text-white shadow-sm">
                      <p>Здравствуйте! Готов помочь. Какой номер заказа?</p>
                      <p className="text-xs mt-1 opacity-70">14:31</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Icon name="Send" size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-900">
              <div className="text-center text-gray-500">
                <Icon name="MessageSquare" size={64} className="mx-auto mb-4 opacity-20" />
                <p>Выберите диалог для начала общения</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
