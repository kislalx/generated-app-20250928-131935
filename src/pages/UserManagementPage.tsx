import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { User } from '@shared/types';
import { api } from '@/lib/api';
import { Toaster, toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { UserDataTable } from '@/components/users/UserDataTable';
import { getColumns } from '@/components/users/UserColumns';
import { UserForm } from '@/components/users/UserForm';
import { UserFormValues } from '@/lib/schemas';
export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<User[]>('/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch user data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/users/${selectedUser.id}`);
      toast.success('User deleted successfully.');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user.');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };
  const handleFormSubmit = async (values: UserFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, values);
        toast.success('User updated successfully.');
      } else {
        await api.post('/users', values);
        toast.success('User created successfully.');
      }
      fetchUsers();
      setIsFormOpen(false);
      setSelectedUser(null);
    } catch (error) {
      toast.error(`Failed to ${selectedUser ? 'update' : 'create'} user.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const columns = getColumns(handleEdit, handleDelete);
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add User
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <UserDataTable columns={columns} data={users} />
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {selectedUser ? 'Update the details for this user account.' : 'Fill in the details to create a new user.'}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleFormSubmit}
            initialData={selectedUser}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for "{selectedUser?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}