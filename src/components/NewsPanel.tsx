import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NewsPanelProps {
  user: any;
}

export function NewsPanel({ user }: NewsPanelProps) {
  const canEdit = user.role === 'super_admin';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Новости</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {canEdit ? 'Добавляйте и редактируйте новости для всей команды' : 'Актуальные новости и объявления'}
        </p>
      </CardContent>
    </Card>
  );
}
