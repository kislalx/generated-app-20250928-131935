import { useEffect, useState } from 'react';
import { AppRole, PermissionGroup } from '@shared/types';
import { api } from '@/lib/api';
import { Toaster, toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, ShieldCheck } from 'lucide-react';
import { PermissionMatrix } from '@/components/roles/PermissionMatrix';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RoleForm } from '@/components/roles/RoleForm';
export function RolesAndPermissionsPage() {
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddRoleDialogOpen, setIsAddRoleDialogOpen] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        api.get<AppRole[]>('/roles'),
        api.get<PermissionGroup[]>('/permissions'),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
      if (rolesData.length > 0) {
        setSelectedRole(rolesData[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch roles and permissions.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (!selectedRole) return;
    const updatedPermissions = checked
      ? [...selectedRole.permissions, permissionId]
      : selectedRole.permissions.filter((p) => p !== permissionId);
    const updatedRole = { ...selectedRole, permissions: updatedPermissions };
    // Update both the selected role and the list of roles
    setSelectedRole(updatedRole);
    setRoles(prevRoles => 
      prevRoles.map(r => (r.id === updatedRole.id ? updatedRole : r))
    );
  };
  const handleSaveChanges = async () => {
    if (!selectedRole) return;
    setIsSaving(true);
    try {
      await api.put(`/roles/${selectedRole.id}`, { permissions: selectedRole.permissions });
      toast.success(`Permissions for ${selectedRole.name} updated successfully.`);
    } catch (error) {
      toast.error('Failed to save changes.');
      // Optionally revert changes on failure
      fetchData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRoleAdded = (newRole: AppRole) => {
    setRoles(prevRoles => [...prevRoles, newRole]);
    setIsAddRoleDialogOpen(false);
    toast.success(`Role "${newRole.name}" created successfully.`);
    setSelectedRole(newRole);
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Roles & Permissions</h2>
          <Button onClick={() => setIsAddRoleDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Role
          </Button>
        </div>
        <Dialog open={isAddRoleDialogOpen} onOpenChange={setIsAddRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
              <DialogDescription>
                Create a new role. You can assign permissions after it's created.
              </DialogDescription>
            </DialogHeader>
            <RoleForm
              onSuccess={handleRoleAdded}
              onCancel={() => setIsAddRoleDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <div className="grid gap-6 md:grid-cols-[280px_1fr] h-[calc(100vh-12rem)]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Roles</CardTitle>
                <CardDescription>Select a role to view and edit its permissions.</CardDescription>
              </CardHeader>
            </Card>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {roles.map(role => (
                  <Button
                    key={role.id}
                    variant={selectedRole?.id === role.id ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full justify-start px-4 py-2 h-auto",
                      selectedRole?.id === role.id && "font-bold"
                    )}
                    onClick={() => setSelectedRole(role)}
                  >
                    <ShieldCheck className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div>{role.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : selectedRole ? (
            <PermissionMatrix
              role={selectedRole}
              permissions={permissions}
              onPermissionChange={handlePermissionChange}
              onSaveChanges={handleSaveChanges}
              isSaving={isSaving}
            />
          ) : (
            <Card className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a role to get started.</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}