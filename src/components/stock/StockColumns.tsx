import { ColumnDef } from '@tanstack/react-table';
import { Stock } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { StockActions } from './StockActions';
export const getColumns = (
  onEdit: (stock: Stock) => void,
  onDelete: (stock: Stock) => void
): ColumnDef<Stock>[] => [
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
  },
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right">{row.original.quantity}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === 'in-stock'
          ? 'default'
          : status === 'low-stock'
          ? 'secondary'
          : 'destructive';
      return (
        <Badge variant={variant} className="capitalize">
          {status.replace('-', ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <StockActions stock={row.original} onEdit={onEdit} onDelete={onDelete} />
    ),
  },
];