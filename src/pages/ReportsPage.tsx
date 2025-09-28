import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, BarChart2 } from 'lucide-react';
import { Report } from '@shared/types';
import { api } from '@/lib/api';
import { Toaster, toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportsDataTable } from '@/components/reports/ReportsDataTable';
import { getColumns } from '@/components/reports/ReportsColumns';
export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.get<Report[]>('/reports');
      setReports(data);
    } catch (error) {
      toast.error('Failed to fetch reports.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);
  const handleGenerateReport = () => {
    setIsGenerating(true);
    toast.info('Generating new report...', {
      description: 'This is a mock action and may take a few seconds.',
    });
    setTimeout(() => {
      setIsGenerating(false);
      toast.success('New report generated successfully!', {
        description: 'The new report is now available in the list below.',
      });
      // In a real app, you would refetch the reports list here.
      // For this mock, we'll just show a success message.
    }, 2500);
  };
  const columns = getColumns();
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Generate New Report</CardTitle>
            <CardDescription>Select the criteria for the report you want to generate.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Type</label>
                <Select defaultValue="stock-summary">
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock-summary">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" /> Stock Summary
                      </div>
                    </SelectItem>
                    <SelectItem value="service-history">
                      <div className="flex items-center">
                        <BarChart2 className="mr-2 h-4 w-4" /> Service History
                      </div>
                    </SelectItem>
                    <SelectItem value="inventory-value">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" /> Inventory Value
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select defaultValue="last-30-days">
                  <SelectTrigger>
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" /> Last 7 Days
                      </div>
                    </SelectItem>
                    <SelectItem value="last-30-days">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
                      </div>
                    </SelectItem>
                    <SelectItem value="this-quarter">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" /> This Quarter
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full sm:w-auto">
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
            <CardDescription>View and download previously generated reports.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <ReportsDataTable columns={columns} data={reports} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}