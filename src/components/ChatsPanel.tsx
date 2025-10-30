import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ChatsPanelProps {
  user: any;
  operatorStatus: string;
}

export function ChatsPanel({ user, operatorStatus }: ChatsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Активные чаты</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Чаты будут назначены когда статус: "На линии"</p>
        <p className="text-xs text-muted-foreground mt-2">Текущий статус: {operatorStatus}</p>
      </CardContent>
    </Card>
  );
}
