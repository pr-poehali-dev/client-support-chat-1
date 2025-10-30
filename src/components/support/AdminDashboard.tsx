import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface User {
  login: string;
  role: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type OperatorStatus = 'online' | 'jira' | 'break' | 'offline';

interface Operator {
  id: number;
  name: string;
  status: OperatorStatus;
  activeChats: number;
  totalChats: number;
}

const statusConfig = {
  online: { label: 'На линии', color: 'bg-green-500' },
  jira: { label: 'Обработка Jira', color: 'bg-blue-500' },
  break: { label: 'Отдых', color: 'bg-yellow-500' },
  offline: { label: 'Не в сети', color: 'bg-gray-500' },
};

const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const { toast } = useToast();
  const [operators] = useState<Operator[]>([
    { id: 1, name: 'Оператор 1', status: 'online', activeChats: 3, totalChats: 15 },
    { id: 2, name: 'Оператор 2', status: 'jira', activeChats: 1, totalChats: 8 },
    { id: 3, name: 'Оператор 3', status: 'break', activeChats: 0, totalChats: 12 },
    { id: 4, name: 'Оператор 4', status: 'offline', activeChats: 0, totalChats: 5 },
  ]);

  const [editMode, setEditMode] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    title: 'Поддержка',
    welcomeMessage: 'Здравствуйте! Чем могу помочь?',
    primaryColor: '#2563eb',
  });

  const handleSaveSettings = () => {
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения успешно применены',
    });
    setEditMode(false);
  };

  const [activeTab, setActiveTab] = useState('operators');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('adminSidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [allRatings, setAllRatings] = useState<any[]>([]);

  useEffect(() => {
    const loadRatings = () => {
      const ratings = JSON.parse(localStorage.getItem('chatRatings') || '[]');
      setAllRatings(ratings.filter((r: any) => !r.awaitingRating && r.rating));
    };
    loadRatings();
    const interval = setInterval(loadRatings, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('adminSidebarCollapsed', JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-gray-800 border-r border-purple-500/30 flex flex-col transition-all duration-300`}>
        <div className="p-6 bg-gradient-to-br from-purple-600 to-violet-600 relative">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 p-1 hover:bg-purple-500/50 rounded transition-colors"
          >
            <Icon name={sidebarCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={20} className="text-white" />
          </button>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={28} className="text-white" />
                <h1 className="text-lg font-bold text-white">Супер-Админ</h1>
              </div>
              <p className="text-xs text-purple-100">Полный контроль системы</p>
            </>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <Icon name="Shield" size={28} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('operators')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'operators'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Операторы' : ''}
            >
              <Icon name="Users" size={20} />
              {!sidebarCollapsed && <span className="font-medium">Операторы</span>}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Аналитика' : ''}
            >
              <Icon name="BarChart3" size={20} />
              {!sidebarCollapsed && <span className="font-medium">Аналитика</span>}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Настройки' : ''}
            >
              <Icon name="Settings" size={20} />
              {!sidebarCollapsed && <span className="font-medium">Настройки</span>}
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-700">
          {!sidebarCollapsed && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Icon name="Crown" size={14} className="mr-1" />
                  Админ
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gray-300 mb-3">
                <Icon name="User" size={16} />
                <span className="text-sm font-medium">{user.login}</span>
              </div>
              <Button 
                variant="secondary" 
                onClick={onLogout}
                className="w-full justify-start"
                size="sm"
              >
                <Icon name="LogOut" size={16} className="mr-2" />
                Выход
              </Button>
            </>
          )}
          {sidebarCollapsed && (
            <div className="flex flex-col gap-3 items-center">
              <Icon name="Crown" size={20} className="text-yellow-500" />
              <Button 
                variant="secondary" 
                onClick={onLogout}
                className="w-full p-2 flex justify-center"
                size="sm"
                title="Выход"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Tabs value={activeTab} className="h-full">

          <TabsContent value="operators" className="space-y-4 p-6">
            <Card className="p-6 bg-gray-800 border-purple-500/30">
              <h2 className="text-xl font-bold mb-4 text-white">Управление операторами</h2>
              
              <div className="grid gap-4">
                {operators.map((operator) => {
                  const status = statusConfig[operator.status];
                  return (
                    <div
                      key={operator.id}
                      className="flex items-center justify-between p-4 bg-gray-700 rounded-lg border border-gray-600"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center">
                          <Icon name="User" size={24} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{operator.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`w-2 h-2 rounded-full ${status.color}`} />
                            <span className="text-sm text-gray-300">{status.label}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{operator.activeChats}</p>
                          <p className="text-xs text-gray-400">Активных</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{operator.totalChats}</p>
                          <p className="text-xs text-gray-400">Всего</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                          <Icon name="Settings" size={16} className="mr-2" />
                          Управление
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
                <Icon name="UserPlus" size={18} className="mr-2" />
                Добавить оператора
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4 p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="p-6 bg-gray-800 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Всего диалогов</p>
                    <p className="text-3xl font-bold text-white mt-2">142</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
                    <Icon name="MessageSquare" size={24} className="text-blue-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gray-800 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Активных операторов</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {operators.filter((o) => o.status === 'online').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-900/50 rounded-full flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-green-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gray-800 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Среднее время ответа</p>
                    <p className="text-3xl font-bold text-white mt-2">2.3м</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-900/50 rounded-full flex items-center justify-center">
                    <Icon name="Clock" size={24} className="text-yellow-400" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gray-800 border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Средняя оценка QC</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {allRatings.length > 0 
                        ? (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
                        : '—'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center">
                    <Icon name="Star" size={24} className="text-purple-400" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 bg-gray-800 border-purple-500/30 mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Оценки качества (QC)</h2>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {allRatings.length === 0 ? (
                    <div className="text-center py-12">
                      <Icon name="Star" size={48} className="mx-auto text-gray-600 mb-3" />
                      <p className="text-gray-400">Оценок пока нет</p>
                    </div>
                  ) : (
                    allRatings.map((rating, idx) => (
                      <Card key={idx} className="p-4 bg-gray-700 border-gray-600">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-white">{rating.clientName}</p>
                            <p className="text-sm text-gray-400">{rating.clientPhone}</p>
                            <p className="text-xs text-gray-500 mt-1">Оператор: {rating.operator}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon
                                key={star}
                                name="Star"
                                size={18}
                                className={star <= rating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(rating.ratedAt).toLocaleString('ru-RU')}
                        </p>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 p-6">
            <Card className="p-6 bg-gray-800 border-purple-500/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Настройки внешнего вида</h2>
                <Button
                  variant={editMode ? 'default' : 'outline'}
                  onClick={() => setEditMode(!editMode)}
                  className={editMode ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
                >
                  <Icon name={editMode ? 'Save' : 'Edit'} size={18} className="mr-2" />
                  {editMode ? 'Готово' : 'Редактировать'}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-200">Заголовок чата</Label>
                  <Input
                    id="title"
                    value={siteSettings.title}
                    onChange={(e) => setSiteSettings({ ...siteSettings, title: e.target.value })}
                    disabled={!editMode}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome" className="text-gray-200">Приветственное сообщение</Label>
                  <Textarea
                    id="welcome"
                    value={siteSettings.welcomeMessage}
                    onChange={(e) => setSiteSettings({ ...siteSettings, welcomeMessage: e.target.value })}
                    disabled={!editMode}
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-gray-200">Основной цвет</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={siteSettings.primaryColor}
                      onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                      disabled={!editMode}
                      className="w-20 h-10 bg-gray-700 border-gray-600"
                    />
                    <Input
                      value={siteSettings.primaryColor}
                      onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                      disabled={!editMode}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {editMode && (
                  <Button onClick={handleSaveSettings} className="w-full bg-purple-600 hover:bg-purple-700">
                    <Icon name="Save" size={18} className="mr-2" />
                    Сохранить изменения
                  </Button>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-4 text-white">Дополнительные возможности</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Icon name="Palette" size={18} className="mr-2" />
                    Темы оформления
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Icon name="Bell" size={18} className="mr-2" />
                    Уведомления
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Icon name="Mail" size={18} className="mr-2" />
                    Email-интеграции
                  </Button>
                  <Button variant="outline" className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Icon name="Zap" size={18} className="mr-2" />
                    Автоответы
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;