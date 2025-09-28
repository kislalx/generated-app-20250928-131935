import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Wrench,
  Users,
  Settings,
  ShieldCheck,
  Warehouse as WarehouseIcon,
  FileText,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stock', label: 'Stock Management', icon: Package },
  { href: '/warehouse', label: 'Warehouse', icon: Warehouse },
  { href: '/service', label: 'Service', icon: Wrench },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/users', label: 'Users', icon: Users, adminOnly: true },
  { href: '/roles', label: 'Roles & Permissions', icon: ShieldCheck, adminOnly: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];
interface SidebarProps {
  className?: string;
}
export function Sidebar({ className }: SidebarProps) {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;
  return (
    <div className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center pl-2 mb-8 space-x-2">
            <WarehouseIcon className="h-8 w-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">PlazaOps</h2>
          </div>
          <div className="space-y-1">
            {navItems.map((item) =>
              (!item.adminOnly || userRole === 'admin') && (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center',
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      )
                    }
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </NavLink>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}