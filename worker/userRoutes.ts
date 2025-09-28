import { Hono } from "hono";
import { Env } from './core-utils';
import { User, Stock, Warehouse, ServiceRecord, UserRole, AppRole, PermissionGroup, Report } from '../shared/types';
// This is a mock database. In a real application, you'd use a database.
let mockUsers: User[] = [
  { id: '1', name: 'Alex Manager', email: 'manager@plazaops.com', role: 'manager', permissions: ['dashboard:view', 'stock:view', 'stock:edit'], avatarUrl: 'https://i.pravatar.cc/150?u=alexmanager', status: 'active' },
  { id: '2', name: 'Chris Admin', email: 'admin@plazaops.com', role: 'admin', permissions: ['*'], avatarUrl: 'https://i.pravatar.cc/150?u=chrisadmin', status: 'active' },
  { id: '3', name: 'Mike Technician', email: 'tech@plazaops.com', role: 'technician', permissions: ['service:view'], avatarUrl: 'https://i.pravatar.cc/150?u=miketech', status: 'active' },
  { id: '4', name: 'Sarah Supervisor', email: 'supervisor@plazaops.com', role: 'manager', permissions: ['dashboard:view', 'stock:view'], avatarUrl: 'https://i.pravatar.cc/150?u=sarahsupervisor', status: 'inactive' },
];
let mockStock: Stock[] = [
  { id: '1', name: 'Tractor Headlight Assembly', sku: 'TR-HD-001', quantity: 50, status: 'in-stock', location: 'Aisle 3, Shelf B' },
  { id: '2', name: 'Engine Oil Filter', sku: 'EN-FL-004', quantity: 120, status: 'in-stock', location: 'Aisle 1, Shelf A' },
  { id: '3', name: 'Hydraulic Pump', sku: 'HY-PM-002', quantity: 8, status: 'low-stock', location: 'Aisle 5, Shelf C' },
  { id: '4', name: 'Alternator Belt', sku: 'AL-BL-007', quantity: 0, status: 'out-of-stock', location: 'Aisle 2, Shelf D' },
  { id: '5', name: 'Spark Plug Set (4-pack)', sku: 'SP-PK-012', quantity: 75, status: 'in-stock', location: 'Aisle 1, Shelf B' },
];
let mockWarehouses: Warehouse[] = [
    { id: 'wh-1', name: 'Main Warehouse', location: '123 Tractor Rd, Plaza City', capacity: 10000, currentStock: 7540 },
    { id: 'wh-2', name: 'East Annex', location: '456 Combine Ave, Plaza City', capacity: 5000, currentStock: 2310 },
    { id: 'wh-3', name: 'Service Center Storage', location: '789 Wrench Ln, Plaza City', capacity: 2500, currentStock: 2450 },
];
let mockServiceRecords: ServiceRecord[] = [
    { id: 'sr-1', customerName: 'John Farmer', tractorModel: 'Plaza 5000', issueDescription: 'Engine won\'t start, making a clicking sound.', status: 'pending', assignedTechnician: 'Mike R.', createdAt: new Date('2023-10-26T09:00:00Z').toISOString() },
    { id: 'sr-2', customerName: 'Jane Smith', tractorModel: 'Plaza 7500 Pro', issueDescription: 'Hydraulic lift is slow and jerky.', status: 'in-progress', assignedTechnician: 'Sarah K.', createdAt: new Date('2023-10-25T14:30:00Z').toISOString() },
    { id: 'sr-3', customerName: 'Bob Johnson', tractorModel: 'Plaza Compact 200', issueDescription: 'Routine 100-hour maintenance.', status: 'completed', assignedTechnician: 'Mike R.', createdAt: new Date('2023-10-24T11:00:00Z').toISOString() },
    { id: 'sr-4', customerName: 'Green Valley Farms', tractorModel: 'Plaza 9000 Turbo', issueDescription: 'Customer cancelled appointment.', status: 'cancelled', createdAt: new Date('2023-10-23T16:00:00Z').toISOString() },
];
let mockRoles: AppRole[] = [
    { id: 'admin', name: 'Administrator', description: 'Has all permissions.', permissions: ['*'] },
    { id: 'manager', name: 'Warehouse Manager', description: 'Manages stock and warehouses.', permissions: ['stock:view', 'stock:create', 'stock:edit', 'warehouse:view', 'warehouse:create', 'warehouse:edit'] },
    { id: 'technician', name: 'Service Technician', description: 'Handles service records.', permissions: ['service:view', 'service:edit-status'] },
];
let mockPermissions: PermissionGroup[] = [
    { id: 'stock', name: 'Stock Management', permissions: [
        { id: 'stock:view', name: 'View Stock', description: 'Can view the list of stock items.' },
        { id: 'stock:create', name: 'Create Stock', description: 'Can add new stock items.' },
        { id: 'stock:edit', name: 'Edit Stock', description: 'Can edit existing stock items.' },
        { id: 'stock:delete', name: 'Delete Stock', description: 'Can delete stock items.' },
    ]},
    { id: 'warehouse', name: 'Warehouse Management', permissions: [
        { id: 'warehouse:view', name: 'View Warehouses', description: 'Can view the list of warehouses.' },
        { id: 'warehouse:create', name: 'Create Warehouse', description: 'Can add new warehouses.' },
        { id: 'warehouse:edit', name: 'Edit Warehouse', description: 'Can edit existing warehouses.' },
        { id: 'warehouse:delete', name: 'Delete Warehouse', description: 'Can delete warehouses.' },
    ]},
    { id: 'service', name: 'Service Management', permissions: [
        { id: 'service:view', name: 'View Service Records', description: 'Can view service records.' },
        { id: 'service:create', name: 'Create Service Record', description: 'Can create new service records.' },
        { id: 'service:edit', name: 'Edit Service Record', description: 'Can edit all details of a service record.' },
        { id: 'service:edit-status', name: 'Update Service Status', description: 'Can only update the status of a service record.' },
        { id: 'service:delete', name: 'Delete Service Record', description: 'Can delete service records.' },
    ]},
    { id: 'users', name: 'User Management', permissions: [
        { id: 'users:view', name: 'View Users', description: 'Can view the list of users.' },
        { id: 'users:create', name: 'Create User', description: 'Can create new users.' },
        { id: 'users:edit', name: 'Edit User', description: 'Can edit existing users.' },
        { id: 'users:delete', name: 'Delete User', description: 'Can delete users.' },
    ]},
];
let mockReports: Report[] = [
    { id: 'rep-1', name: 'Q3 2023 Stock Summary', generatedOn: new Date('2023-10-01T10:00:00Z').toISOString(), type: 'Stock Summary', downloadUrl: '#' },
    { id: 'rep-2', name: 'September 2023 Service History', generatedOn: new Date('2023-10-01T10:05:00Z').toISOString(), type: 'Service History', downloadUrl: '#' },
    { id: 'rep-3', name: 'Q3 2023 Inventory Value', generatedOn: new Date('2023-10-02T11:30:00Z').toISOString(), type: 'Inventory Value', downloadUrl: '#' },
    { id: 'rep-4', name: 'October 2023 Stock Summary', generatedOn: new Date('2023-11-01T09:00:00Z').toISOString(), type: 'Stock Summary', downloadUrl: '#' },
];
const checkAuth = (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401);
  }
  const token = authHeader.substring(7);
  if (token.startsWith('mock-jwt-for-')) {
    return next();
  }
  return c.json({ message: 'Invalid token' }, 401);
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- AUTH ROUTES ---
  app.post('/api/auth/login', async (c) => {
    const { email, password } = await c.req.json();
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') { // Mock password
      return c.json({ message: 'Invalid credentials' }, 401);
    }
    const token = `mock-jwt-for-${user.id}-at-${Date.now()}`;
    return c.json({ token, user });
  });
  app.get('/api/auth/me', (c) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    const token = authHeader.substring(7);
    if (token.startsWith('mock-jwt-for-')) {
      const userId = token.split('-')[3];
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        return c.json(user);
      }
    }
    return c.json({ message: 'Invalid token' }, 401);
  });
  // --- USER ROUTES ---
  const userRoutes = new Hono().basePath('/api/users');
  userRoutes.use('*', checkAuth);
  userRoutes.get('/', (c) => c.json(mockUsers));
  userRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const newUser: User = {
      id: `usr-${Date.now()}`,
      permissions: [],
      avatarUrl: `https://i.pravatar.cc/150?u=${body.email}`,
      ...body,
    };
    mockUsers.push(newUser);
    return c.json(newUser, 201);
  });
  userRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = mockUsers.findIndex(item => item.id === id);
    if (index === -1) return c.json({ message: 'User not found' }, 404);
    mockUsers[index] = { ...mockUsers[index], ...body };
    return c.json(mockUsers[index]);
  });
  userRoutes.delete('/:id', (c) => {
    const id = c.req.param('id');
    const initialLength = mockUsers.length;
    mockUsers = mockUsers.filter(item => item.id !== id);
    if (mockUsers.length === initialLength) return c.json({ message: 'User not found' }, 404);
    return c.newResponse(null, 204);
  });
  app.route('/', userRoutes);
  // --- STOCK ROUTES ---
  const stockRoutes = new Hono().basePath('/api/stock');
  stockRoutes.use('*', checkAuth);
  stockRoutes.get('/', (c) => c.json(mockStock));
  stockRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const newItem: Stock = { id: `stk-${Date.now()}`, ...body };
    mockStock.push(newItem);
    return c.json(newItem, 201);
  });
  stockRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = mockStock.findIndex(item => item.id === id);
    if (index === -1) return c.json({ message: 'Item not found' }, 404);
    mockStock[index] = { ...mockStock[index], ...body };
    return c.json(mockStock[index]);
  });
  stockRoutes.delete('/:id', (c) => {
    const id = c.req.param('id');
    const initialLength = mockStock.length;
    mockStock = mockStock.filter(item => item.id !== id);
    if (mockStock.length === initialLength) return c.json({ message: 'Item not found' }, 404);
    return c.newResponse(null, 204);
  });
  app.route('/', stockRoutes);
  // --- WAREHOUSE ROUTES ---
  const warehouseRoutes = new Hono().basePath('/api/warehouses');
  warehouseRoutes.use('*', checkAuth);
  warehouseRoutes.get('/', (c) => c.json(mockWarehouses));
  warehouseRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const newWarehouse: Warehouse = { id: `wh-${Date.now()}`, currentStock: 0, ...body };
    mockWarehouses.push(newWarehouse);
    return c.json(newWarehouse, 201);
  });
  warehouseRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = mockWarehouses.findIndex(wh => wh.id === id);
    if (index === -1) return c.json({ message: 'Warehouse not found' }, 404);
    mockWarehouses[index] = { ...mockWarehouses[index], ...body };
    return c.json(mockWarehouses[index]);
  });
  warehouseRoutes.delete('/:id', (c) => {
    const id = c.req.param('id');
    const initialLength = mockWarehouses.length;
    mockWarehouses = mockWarehouses.filter(wh => wh.id !== id);
    if (mockWarehouses.length === initialLength) return c.json({ message: 'Warehouse not found' }, 404);
    return c.newResponse(null, 204);
  });
  app.route('/', warehouseRoutes);
  // --- SERVICE RECORD ROUTES ---
  const serviceRoutes = new Hono().basePath('/api/service-records');
  serviceRoutes.use('*', checkAuth);
  serviceRoutes.get('/', (c) => c.json(mockServiceRecords));
  serviceRoutes.post('/', async (c) => {
    const body = await c.req.json();
    const newRecord: ServiceRecord = { id: `sr-${Date.now()}`, createdAt: new Date().toISOString(), ...body };
    mockServiceRecords.unshift(newRecord);
    return c.json(newRecord, 201);
  });
  serviceRoutes.put('/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const index = mockServiceRecords.findIndex(item => item.id === id);
    if (index === -1) return c.json({ message: 'Service record not found' }, 404);
    mockServiceRecords[index] = { ...mockServiceRecords[index], ...body };
    return c.json(mockServiceRecords[index]);
  });
  serviceRoutes.delete('/:id', (c) => {
    const id = c.req.param('id');
    const initialLength = mockServiceRecords.length;
    mockServiceRecords = mockServiceRecords.filter(item => item.id !== id);
    if (mockServiceRecords.length === initialLength) return c.json({ message: 'Service record not found' }, 404);
    return c.newResponse(null, 204);
  });
  app.route('/', serviceRoutes);
  // --- ROLES & PERMISSIONS ROUTES ---
  const rolesRoutes = new Hono().basePath('/api');
  rolesRoutes.use('/roles*', checkAuth);
  rolesRoutes.use('/permissions*', checkAuth);
  rolesRoutes.get('/roles', (c) => c.json(mockRoles));
  rolesRoutes.put('/roles/:id', async (c) => {
    const id = c.req.param('id');
    const { permissions } = await c.req.json();
    const index = mockRoles.findIndex(role => role.id === id);
    if (index === -1) return c.json({ message: 'Role not found' }, 404);
    mockRoles[index].permissions = permissions;
    return c.json(mockRoles[index]);
  });
  rolesRoutes.get('/permissions', (c) => c.json(mockPermissions));
  app.route('/', rolesRoutes);
  // --- REPORTS ROUTES ---
  const reportsRoutes = new Hono().basePath('/api/reports');
  reportsRoutes.use('*', checkAuth);
  reportsRoutes.get('/', (c) => c.json(mockReports));
  app.route('/', reportsRoutes);
}