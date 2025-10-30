import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface QCPortalProps {
  user: any;
}

export function QCPortal({ user }: QCPortalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Портал контроля качества</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Здесь можно оценивать чаты операторов (0-130 баллов)</p>
      </CardContent>
    </Card>
  );
}
