import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ServiceRecord } from '@shared/types';
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
import { ServiceDataTable } from '@/components/service/ServiceDataTable';
import { getColumns } from '@/components/service/ServiceColumns';
import { ServiceForm } from '@/components/service/ServiceForm';
import { ServiceRecordFormValues } from '@/lib/schemas';
export function ServiceManagementPage() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchServiceRecords = async () => {
    setLoading(true);
    try {
      const data = await api.get<ServiceRecord[]>('/service-records');
      setRecords(data);
    } catch (error) {
      toast.error('Failed to fetch service records.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchServiceRecords();
  }, []);
  const handleAdd = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };
  const handleEdit = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };
  const handleDelete = (record: ServiceRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/service-records/${selectedRecord.id}`);
      toast.success('Service record deleted successfully.');
      fetchServiceRecords();
    } catch (error) {
      toast.error('Failed to delete service record.');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedRecord(null);
    }
  };
  const handleFormSubmit = async (values: ServiceRecordFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedRecord) {
        await api.put(`/service-records/${selectedRecord.id}`, values);
        toast.success('Service record updated successfully.');
      } else {
        await api.post('/service-records', values);
        toast.success('Service record created successfully.');
      }
      fetchServiceRecords();
      setIsFormOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      toast.error(`Failed to ${selectedRecord ? 'update' : 'create'} service record.`);
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
          <h2 className="text-3xl font-bold tracking-tight">Service Management</h2>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Service Record
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <ServiceDataTable columns={columns} data={records} />
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedRecord ? 'Edit Service Record' : 'Create New Service Record'}</DialogTitle>
            <DialogDescription>
              {selectedRecord ? 'Update the details of the service record.' : 'Fill in the details for the new service record.'}
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            onSubmit={handleFormSubmit}
            initialData={selectedRecord}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service record for "{selectedRecord?.customerName}".
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