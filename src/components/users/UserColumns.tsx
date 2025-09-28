import { ColumnDef } from '@tanstack/react-table';
import { User } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { UserActions } from './UserActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}
export const getColumns = (
  onEdit: (user: User) => void,
  onDelete: (user: User) => void
): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
        const user = row.original;
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                </div>
            </div>
        )
    }
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <div className="capitalize">{row.original.role}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = status === 'active' ? 'default' : 'secondary';
      const colorClass = status === 'active' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 'bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30';
      return (
        <Badge variant={variant} className={`capitalize ${colorClass}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="text-right">
        <UserActions user={row.original} onEdit={onEdit} onDelete={onDelete} />
      </div>
    ),
  },
];