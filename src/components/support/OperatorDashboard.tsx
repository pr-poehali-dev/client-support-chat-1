import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  clientPhone: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  assignedTo: string;
}

interface NewsItem {
  id: number;
  title: string;
  content: string;
  date: Date;
  author: string;
}

interface QCReport {
  id: number;
  chatId: number;
  score: number;
  feedback: string;
  date: Date;
}

const OperatorDashboard = ({ user, onLogout }: OperatorDashboardProps) => {
  const [status, setStatus] = useState<OperatorStatus>('online');
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [message, setMessage] = useState('');

  const allChats: ChatSession[] = [
    {
      id: 1,
      clientName: 'Иван Петров',
      clientPhone: '+7 (999) 123-45-67',
      lastMessage: 'Здравствуйте! У меня вопрос по заказу',
      timestamp: new Date(),
      unread: 2,
      assignedTo: user.login,
    },
    {
      id: 2,
      clientName: 'Мария Сидорова',
      clientPhone: '+7 (999) 234-56-78',
      lastMessage: 'Не могу войти в личный кабинет',
      timestamp: new Date(Date.now() - 300000),
      unread: 1,
      assignedTo: user.login,
    },
    {
      id: 3,
      clientName: 'Алексей Иванов',
      clientPhone: '+7 (999) 345-67-89',
      lastMessage: 'Когда будет доставка?',
      timestamp: new Date(Date.now() - 600000),
      unread: 0,
      assignedTo: 'operator2',
    },
  ];

  const myChats = allChats.filter(chat => chat.assignedTo === user.login);

  const news: NewsItem[] = [
    {
      id: 1,
      title: 'Новые правила работы',
      content: 'С понедельника вводятся новые правила обработки заявок. Необходимо отвечать в течение 2 минут.',
      date: new Date(),
      author: 'Администратор',
    },
    {
      id: 2,
      title: 'Обновление системы',
      content: 'В выходные будет проведено плановое обновление системы. Время простоя: 2 часа.',
      date: new Date(Date.now() - 86400000),
      author: 'Администратор',
    },
  ];

  const myScores: QCReport[] = [
    { id: 1, chatId: 1001, score: 9, feedback: 'Отличная работа, быстро решил проблему', date: new Date() },
    { id: 2, chatId: 1002, score: 7, feedback: 'Хорошо, но нужно улучшить скорость ответов', date: new Date(Date.now() - 86400000) },
  ];

  const currentStatus = statusConfig[status];
  const avgScore = myScores.reduce((sum, s) => sum + s.score, 0) / myScores.length || 0;

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

      <div className="p-6">
        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="bg-gray-800 border-gray-700 mb-6">
            <TabsTrigger value="chats" className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Icon name="MessageSquare" size={18} />
              Мои диалоги ({myChats.length})
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Icon name="Newspaper" size={18} />
              Новости
            </TabsTrigger>
            <TabsTrigger value="scores" className="gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Icon name="Star" size={18} />
              Мои оценки
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats">
            <div className="flex gap-4 h-[calc(100vh-200px)]">
              <Card className="w-80 bg-gray-800 border-purple-500/30 flex flex-col">
                <div className="p-4 border-b border-gray-700">
                  <h2 className="font-semibold text-white mb-2">Назначенные мне</h2>
                  <p className="text-sm text-gray-400">{myChats.length} диалогов</p>
                </div>

                <ScrollArea className="flex-1">
                  {myChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setActiveChat(chat.id)}
                      className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700/50 ${
                        activeChat === chat.id ? 'bg-purple-900/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-white">{chat.clientName}</p>
                          <p className="text-xs text-gray-500">{chat.clientPhone}</p>
                        </div>
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
              </Card>

              <Card className="flex-1 bg-gray-800 border-purple-500/30 flex flex-col">
                {activeChat ? (
                  <>
                    <div className="p-4 bg-gray-800 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-white">
                            {myChats.find((c) => c.id === activeChat)?.clientName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {myChats.find((c) => c.id === activeChat)?.clientPhone}
                          </p>
                        </div>
                        <Badge className="bg-green-600">Активный</Badge>
                      </div>
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
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="news">
            <Card className="p-6 bg-gray-800 border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-6">Новости и объявления</h2>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {news.map((item) => (
                    <Card key={item.id} className="p-5 bg-gray-700 border-gray-600">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-white text-lg">{item.title}</h3>
                        <Badge variant="outline" className="border-gray-500 text-gray-300">
                          {item.date.toLocaleDateString('ru-RU')}
                        </Badge>
                      </div>
                      <p className="text-gray-300 mb-2">{item.content}</p>
                      <p className="text-xs text-gray-500">Автор: {item.author}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="scores">
            <Card className="p-6 bg-gray-800 border-purple-500/30">
              <h2 className="text-xl font-bold text-white mb-6">Мои оценки качества</h2>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gray-700 border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center">
                      <Icon name="Star" size={24} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Средняя оценка</p>
                      <p className="text-3xl font-bold text-white">{avgScore.toFixed(1)}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gray-700 border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
                      <Icon name="FileText" size={24} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Всего оценок</p>
                      <p className="text-3xl font-bold text-white">{myScores.length}</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-gray-700 border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Отличных (8+)</p>
                      <p className="text-3xl font-bold text-white">
                        {myScores.filter(s => s.score >= 8).length}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <ScrollArea className="h-[450px]">
                <div className="space-y-3">
                  {myScores.map((report) => (
                    <Card key={report.id} className="p-4 bg-gray-700 border-gray-600">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={report.score >= 8 ? 'bg-green-600' : report.score >= 6 ? 'bg-yellow-600' : 'bg-red-600'}>
                            {report.score}/10
                          </Badge>
                          <span className="text-sm text-gray-400">Чат #{report.chatId}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {report.date.toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{report.feedback}</p>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OperatorDashboard;
