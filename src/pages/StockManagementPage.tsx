import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { StockDataTable } from '@/components/stock/StockDataTable';
import { getColumns } from '@/components/stock/StockColumns';
import { Stock } from '@shared/types';
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
import { StockForm } from '@/components/stock/StockForm';
import { StockFormValues, stockFormSchema } from '@/lib/schemas';
import { Skeleton } from '@/components/ui/skeleton';
export function StockManagementPage() {
  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchStock = async () => {
    setLoading(true);
    try {
      const data = await api.get<Stock[]>('/stock');
      setStock(data);
    } catch (error) {
      toast.error('Failed to fetch stock data.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStock();
  }, []);
  const handleAdd = () => {
    setSelectedStock(null);
    setIsFormOpen(true);
  };
  const handleEdit = (stockItem: Stock) => {
    setSelectedStock(stockItem);
    setIsFormOpen(true);
  };
  const handleDelete = (stockItem: Stock) => {
    setSelectedStock(stockItem);
    setIsDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!selectedStock) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/stock/${selectedStock.id}`);
      toast.success('Stock item deleted successfully.');
      fetchStock(); // Refresh data
    } catch (error) {
      toast.error('Failed to delete stock item.');
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setSelectedStock(null);
    }
  };
  const handleFormSubmit = async (values: StockFormValues) => {
    setIsSubmitting(true);
    try {
      if (selectedStock) {
        // Update
        await api.put(`/stock/${selectedStock.id}`, values);
        toast.success('Stock item updated successfully.');
      } else {
        // Create
        await api.post('/stock', values);
        toast.success('Stock item created successfully.');
      }
      fetchStock();
      setIsFormOpen(false);
      setSelectedStock(null);
    } catch (error) {
      toast.error(`Failed to ${selectedStock ? 'update' : 'create'} stock item.`);
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
          <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
          <Button onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Stock
          </Button>
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <StockDataTable columns={columns} data={stock} />
        )}
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedStock ? 'Edit Stock Item' : 'Add New Stock Item'}</DialogTitle>
            <DialogDescription>
              {selectedStock ? 'Update the details of the stock item.' : 'Fill in the details to add a new item.'}
            </DialogDescription>
          </DialogHeader>
          <StockForm
            onSubmit={handleFormSubmit}
            initialData={selectedStock}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the stock item "{selectedStock?.name}".
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