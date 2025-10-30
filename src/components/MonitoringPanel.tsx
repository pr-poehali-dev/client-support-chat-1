import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MonitoringPanelProps {
  user: any;
}

export function MonitoringPanel({ user }: MonitoringPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мониторинг операторов</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Здесь отображается активность операторов в реальном времени</p>
      </CardContent>
    </Card>
  );
}
