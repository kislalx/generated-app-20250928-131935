import { AppRole, PermissionGroup } from '@shared/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
interface PermissionMatrixProps {
  role: AppRole;
  permissions: PermissionGroup[];
  onPermissionChange: (permissionId: string, checked: boolean) => void;
  onSaveChanges: () => void;
  isSaving: boolean;
}
export function PermissionMatrix({ role, permissions, onPermissionChange, onSaveChanges, isSaving }: PermissionMatrixProps) {
  const isAllPermissionsGranted = role.permissions.includes('*');
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{role.name}</CardTitle>
        <CardDescription>{role.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <Accordion type="multiple" defaultValue={permissions.map(p => p.id)} className="w-full">
          {permissions.map((group) => (
            <AccordionItem value={group.id} key={group.id}>
              <AccordionTrigger className="text-lg font-semibold">{group.name}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {group.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={permission.id}
                        checked={isAllPermissionsGranted || role.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => onPermissionChange(permission.id, !!checked)}
                        disabled={isAllPermissionsGranted}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={permission.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.name}
                        </label>
                        <p className="text-sm text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      <div className="p-6 border-t">
        <Button onClick={onSaveChanges} className="w-full" disabled={isSaving || isAllPermissionsGranted}>
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isAllPermissionsGranted ? 'Administrator has all permissions' : 'Save Changes'}
        </Button>
      </div>
    </Card>
  );
}