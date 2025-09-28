import { Warehouse as WarehouseType } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MoreHorizontal, Pencil, Trash2, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
interface WarehouseCardProps {
  warehouse: WarehouseType;
  onEdit: (warehouse: WarehouseType) => void;
  onDelete: (warehouse: WarehouseType) => void;
}
export function WarehouseCard({ warehouse, onEdit, onDelete }: WarehouseCardProps) {
  const fillPercentage = (warehouse.currentStock / warehouse.capacity) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row items-start justify-between pb-4">
          <div>
            <CardTitle className="text-xl font-bold">{warehouse.name}</CardTitle>
            <CardDescription className="flex items-center pt-1 text-sm text-muted-foreground">
              <MapPin className="mr-1.5 h-4 w-4" />
              {warehouse.location}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(warehouse)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(warehouse)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-end">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Package className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-semibold">{warehouse.currentStock.toLocaleString()}</span> / {warehouse.capacity.toLocaleString()} units
              </span>
            </div>
            <div>
              <Progress value={fillPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-right">{fillPercentage.toFixed(1)}% Full</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}