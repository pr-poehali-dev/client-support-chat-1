import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function StaffManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление сотрудниками</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Управление логинами, паролями и ролями сотрудников</p>
      </CardContent>
    </Card>
  );
}
