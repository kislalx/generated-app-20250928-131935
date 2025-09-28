import { ColumnDef } from '@tanstack/react-table';
import { Report } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Download, FileText, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
export const getColumns = (): ColumnDef<Report>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Report Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      const Icon = type === 'Stock Summary' ? FileText : BarChart2;
      return (
        <div className="flex items-center">
          <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return <Badge variant="outline">{row.original.type}</Badge>;
    },
  },
  {
    accessorKey: 'generatedOn',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Generated On
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => format(new Date(row.original.generatedOn), 'dd MMM yyyy, HH:mm'),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(row.original.downloadUrl, '_blank')}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </div>
    ),
  },
];