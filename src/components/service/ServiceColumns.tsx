import { ColumnDef } from '@tanstack/react-table';
import { ServiceRecord } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { ServiceActions } from './ServiceActions';
import { format } from 'date-fns';
export const getColumns = (
  onEdit: (record: ServiceRecord) => void,
  onDelete: (record: ServiceRecord) => void
): ColumnDef<ServiceRecord>[] => [
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: 'tractorModel',
    header: 'Tractor Model',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant: 'default' | 'secondary' | 'destructive' | 'outline' =
        status === 'completed'
          ? 'default'
          : status === 'in-progress'
          ? 'secondary'
          : status === 'cancelled'
          ? 'destructive'
          : 'outline';
      const colorClass = 
        status === 'completed' ? 'bg-green-500/20 text-green-700 border-green-500/30' :
        status === 'in-progress' ? 'bg-blue-500/20 text-blue-700 border-blue-500/30' :
        status === 'pending' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' :
        'bg-red-500/20 text-red-700 border-red-500/30';
      return (
        <Badge variant={variant} className={`capitalize ${colorClass}`}>
          {status.replace('-', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'assignedTechnician',
    header: 'Technician',
    cell: ({ row }) => row.original.assignedTechnician || 'N/A',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    cell: ({ row }) => format(new Date(row.original.createdAt), 'dd MMM yyyy'),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <ServiceActions record={row.original} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];