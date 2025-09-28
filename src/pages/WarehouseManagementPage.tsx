import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Warehouse } from '@shared/types';
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
import { WarehouseCard } from '@/components/warehouse/WarehouseCard';
import { WarehouseForm } from '@/components/warehouse/WarehouseForm';
import { WarehouseFormValues } from '@/lib/schemas';
export function WarehouseManagementPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const data = await api.get<Warehouse[]>('/warehouses');
      setWarehouses(data);
    } catch (error) {
      toast.error('Failed to fetch warehouse data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWarehouses();
  }, []);
  const handleAdd = () => {
    setSelectedWarehouse(null);
    setIsFormOpen(true);
  };
  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsFormOpen(true);
  };
  const handleDelete = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedWarehouse) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/warehouses/${selectedWarehouse.id}`);
      toast.success('Warehouse deleted successfully.');
      fetchWarehouses();
    } catch (error) {
      toast.error('Failed to delete warehouse.');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedWarehouse(null);
    }
  };
  const handleFormSubmit = async (values: WarehouseFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedWarehouse) {
        await api.put(`/warehouses/${selectedWarehouse.id}`, values);
        toast.success('Warehouse updated successfully.');
      } else {
        await api.post('/warehouses', values);
        toast.success('Warehouse created successfully.');
      }
      fetchWarehouses();
      setIsFormOpen(false);
      setSelectedWarehouse(null);
    } catch (error) {
      toast.error(`Failed to ${selectedWarehouse ? 'update' : 'create'} warehouse.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Warehouse Management</h2>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Warehouse
          </Button>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((warehouse) => (
              <WarehouseCard
                key={warehouse.id}
                warehouse={warehouse}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedWarehouse ? 'Edit Warehouse' : 'Add New Warehouse'}</DialogTitle>
            <DialogDescription>
              {selectedWarehouse ? 'Update the details of the warehouse.' : 'Fill in the details to add a new warehouse.'}
            </DialogDescription>
          </DialogHeader>
          <WarehouseForm
            onSubmit={handleFormSubmit}
            initialData={selectedWarehouse}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the warehouse "{selectedWarehouse?.name}".
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