"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/shared/date-range-picker';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/lib/api-config';
import { DateRange } from 'react-day-picker';

interface MotorReportItem {
  id: string;
  platNomor: string;
  status: string;
  totalTransaksi: number;
  totalPendapatan: number;
  jenis: {
    merk: string;
    model: string;
    cc: number;
  };
}

interface MotorReportResponse {
  data: MotorReportItem[];
  totalPendapatan: number;
  periode: {
    mulai: string;
    selesai: string;
  };
}

export const MotorReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<MotorReportResponse | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });
  const { toast } = useToast();

  const fetchReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Pilih rentang tanggal",
        description: "Silakan pilih rentang tanggal untuk laporan",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const fromDate = dateRange.from.toISOString().split('T')[0];
      const toDate = dateRange.to.toISOString().split('T')[0];
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/unit-motor/laporan?startDate=${fromDate}&endDate=${toDate}`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data laporan');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching motor report:', error);
      toast({
        title: "Gagal mengambil laporan",
        description: "Terjadi kesalahan saat mengambil data laporan motor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'TERSEDIA':
        return 'bg-green-100 text-green-800';
      case 'DISEWA':
        return 'bg-blue-100 text-blue-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Laporan Penggunaan Motor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-auto">
              <DatePickerWithRange 
                date={dateRange}
                setDate={setDateRange}
              />
            </div>
            <Button 
              onClick={fetchReport} 
              disabled={isLoading}
            >
              {isLoading ? 'Memuat...' : 'Tampilkan Laporan'}
            </Button>
          </div>
          
          {reportData && (
            <div className="mt-4">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Periode: {new Date(reportData.periode.mulai).toLocaleDateString('id-ID')} - {new Date(reportData.periode.selesai).toLocaleDateString('id-ID')}
                </h3>
                <div className="text-lg font-bold">
                  Total Pendapatan: {formatCurrency(reportData.totalPendapatan)}
                </div>
              </div>
              
              {reportData.data.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/10">
                  <p>Tidak ada data motor dalam periode ini</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">Motor</th>
                        <th className="px-4 py-2 text-left font-medium">Plat Nomor</th>
                        <th className="px-4 py-2 text-left font-medium">CC</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-left font-medium">Total Transaksi</th>
                        <th className="px-4 py-2 text-left font-medium">Total Pendapatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2">{item.jenis.merk} {item.jenis.model}</td>
                          <td className="px-4 py-2">{item.platNomor}</td>
                          <td className="px-4 py-2">{item.jenis.cc} CC</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">{item.totalTransaksi} kali</td>
                          <td className="px-4 py-2 font-medium">{formatCurrency(item.totalPendapatan)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MotorReport; 