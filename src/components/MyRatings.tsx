import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MyRatingsProps {
  userId: number;
}

export function MyRatings({ userId }: MyRatingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Мои оценки от ОКК</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Здесь будут отображаться ваши оценки от контроля качества</p>
      </CardContent>
    </Card>
  );
}
