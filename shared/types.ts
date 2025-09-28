export type UserRole = 'admin' | 'manager' | 'technician';
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
  status?: 'active' | 'inactive';
}
export interface Stock {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location: string;
}
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
}
export interface ServiceRecord {
  id:string;
  customerName: string;
  tractorModel: string;
  issueDescription: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTechnician?: string;
  createdAt: string;
}
export interface AppRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
export interface PermissionGroup {
  id: string;
  name: string;
  permissions: {
    id: string;
    name: string;
    description: string;
  }[];
}
export interface Report {
  id: string;
  name: string;
  generatedOn: string; // ISO Date String
  type: 'Stock Summary' | 'Service History' | 'Inventory Value';
  downloadUrl: string;
}