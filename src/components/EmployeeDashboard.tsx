import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { ChatsPanel } from '@/components/ChatsPanel';
import { MyRatings } from '@/components/MyRatings';
import { QCPortal } from '@/components/QCPortal';
import { MonitoringPanel } from '@/components/MonitoringPanel';
import { StaffManagement } from '@/components/StaffManagement';
import { NewsPanel } from '@/components/NewsPanel';

interface EmployeeDashboardProps {
  user: any;
  onLogout: () => void;
}

const statusOptions = [
  { value: 'online', label: 'На линии', color: 'bg-green-500' },
  { value: 'jira', label: 'Обработка Jira', color: 'bg-blue-500' },
  { value: 'rest', label: 'Отдых', color: 'bg-yellow-500' },
  { value: 'offline', label: 'Не в сети', color: 'bg-gray-500' }
];

export function EmployeeDashboard({ user, onLogout }: EmployeeDashboardProps) {
  const [status, setStatus] = useState(user.status || 'online');

  const currentStatus = statusOptions.find(s => s.value === status);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Icon name="Headphones" size={28} className="text-blue-600" />
              <h1 className="text-xl font-semibold text-slate-900">Панель сотрудника</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Статус:</span>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-48">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${currentStatus?.color}`} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.display_name || user.username}</p>
                <Badge variant="outline" className="text-xs">
                  {user.role === 'super_admin' ? 'Супер-админ' : user.role === 'qcc' ? 'ОКК' : 'Оператор'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <Tabs defaultValue="chats" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="chats">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Чаты
            </TabsTrigger>
            <TabsTrigger value="ratings">
              <Icon name="Star" size={16} className="mr-2" />
              Мои оценки
            </TabsTrigger>
            {(user.role === 'qcc' || user.role === 'super_admin') && (
              <TabsTrigger value="qc">
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Портал QC
              </TabsTrigger>
            )}
            {(user.role === 'qcc' || user.role === 'super_admin') && (
              <TabsTrigger value="monitoring">
                <Icon name="Activity" size={16} className="mr-2" />
                Мониторинг
              </TabsTrigger>
            )}
            {user.role === 'super_admin' && (
              <TabsTrigger value="staff">
                <Icon name="Users" size={16} className="mr-2" />
                Сотрудники
              </TabsTrigger>
            )}
            <TabsTrigger value="news">
              <Icon name="Newspaper" size={16} className="mr-2" />
              Новости
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats">
            <ChatsPanel user={user} operatorStatus={status} />
          </TabsContent>

          <TabsContent value="ratings">
            <MyRatings userId={user.id} />
          </TabsContent>

          {(user.role === 'qcc' || user.role === 'super_admin') && (
            <TabsContent value="qc">
              <QCPortal user={user} />
            </TabsContent>
          )}

          {(user.role === 'qcc' || user.role === 'super_admin') && (
            <TabsContent value="monitoring">
              <MonitoringPanel user={user} />
            </TabsContent>
          )}

          {user.role === 'super_admin' && (
            <TabsContent value="staff">
              <StaffManagement />
            </TabsContent>
          )}

          <TabsContent value="news">
            <NewsPanel user={user} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
