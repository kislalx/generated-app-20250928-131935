import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServiceRecord } from '@shared/types';
import { Loader2 } from 'lucide-react';
import { serviceRecordFormSchema, ServiceRecordFormValues } from '@/lib/schemas';
interface ServiceFormProps {
  onSubmit: (values: ServiceRecordFormValues) => void;
  initialData?: ServiceRecord | null;
  isLoading?: boolean;
}
export function ServiceForm({ onSubmit, initialData, isLoading }: ServiceFormProps) {
  const form = useForm<ServiceRecordFormValues>({
    resolver: zodResolver(serviceRecordFormSchema),
    defaultValues: initialData
      ? {
          customerName: initialData.customerName,
          tractorModel: initialData.tractorModel,
          issueDescription: initialData.issueDescription,
          status: initialData.status,
          assignedTechnician: initialData.assignedTechnician || '',
        }
      : {
          customerName: '',
          tractorModel: '',
          issueDescription: '',
          status: 'pending',
          assignedTechnician: '',
        },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Farmer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tractorModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tractor Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Plaza 5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="issueDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the issue..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTechnician"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Technician</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mike R." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Save Changes' : 'Create Record'}
        </Button>
      </form>
    </Form>
  );
}