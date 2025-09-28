import * as z from 'zod';
// Schema for the stock form
export const stockFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  sku: z.string().min(3, { message: 'SKU must be at least 3 characters.' }),
  quantity: z.number().int().min(0, { message: 'Quantity must be a positive number.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  status: z.enum(['in-stock', 'low-stock', 'out-of-stock']),
});
export type StockFormValues = z.infer<typeof stockFormSchema>;
// Schema for the warehouse form
export const warehouseFormSchema = z.object({
    name: z.string().min(3, { message: 'Warehouse name must be at least 3 characters.' }),
    location: z.string().min(5, { message: 'Location must be at least 5 characters.' }),
    capacity: z.number().int().min(1, { message: 'Capacity must be at least 1.' }),
});
export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>;
// Schema for the service record form
export const serviceRecordFormSchema = z.object({
    customerName: z.string().min(3, { message: 'Customer name is required.' }),
    tractorModel: z.string().min(2, { message: 'Tractor model is required.' }),
    issueDescription: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
    status: z.enum(['pending', 'in-progress', 'completed', 'cancelled']),
    assignedTechnician: z.string().optional(),
});
export type ServiceRecordFormValues = z.infer<typeof serviceRecordFormSchema>;
// Schema for the user form
export const userFormSchema = z.object({
    name: z.string().min(3, { message: 'Full name must be at least 3 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email address.' }),
    role: z.enum(['admin', 'manager', 'technician']),
    status: z.enum(['active', 'inactive']),
});
export type UserFormValues = z.infer<typeof userFormSchema>;
// Schema for the role form
export const roleFormSchema = z.object({
    name: z.string().min(3, { message: 'Role name must be at least 3 characters.' }),
});
export type RoleFormValues = z.infer<typeof roleFormSchema>;