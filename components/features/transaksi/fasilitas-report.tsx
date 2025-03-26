"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/shared/date-range-picker';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/lib/api-config';

interface FasilitasReportItem {
  id: string;
  namaPenyewa: string;
  jasHujan: number;
  helm: number;
  totalBiaya: number;
  updatedAt: string;
}

interface FasilitasReportResponse {
  data: FasilitasReportItem[];
  totalJasHujan: number;
  totalHelm: number;
  periode: {
    mulai: string;
    selesai: string;
  };
}

export const FasilitasReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<FasilitasReportResponse | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
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
        `${API_CONFIG.BASE_URL}/transaksi/laporan/fasilitas?startDate=${fromDate}&endDate=${toDate}`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data laporan');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching fasilitas report:', error);
      toast({
        title: "Gagal mengambil laporan",
        description: "Terjadi kesalahan saat mengambil data laporan fasilitas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Laporan Penggunaan Fasilitas</CardTitle>
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
                <div className="flex gap-4">
                  <div className="text-sm font-medium">
                    Total Jas Hujan: <span className="font-bold">{reportData.totalJasHujan}</span> unit
                  </div>
                  <div className="text-sm font-medium">
                    Total Helm: <span className="font-bold">{reportData.totalHelm}</span> unit
                  </div>
                </div>
              </div>
              
              {reportData.data.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/10">
                  <p>Tidak ada penggunaan fasilitas dalam periode ini</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">ID Transaksi</th>
                        <th className="px-4 py-2 text-left font-medium">Nama Penyewa</th>
                        <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                        <th className="px-4 py-2 text-left font-medium">Jas Hujan</th>
                        <th className="px-4 py-2 text-left font-medium">Helm</th>
                        <th className="px-4 py-2 text-left font-medium">Total Biaya</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2">{item.id}</td>
                          <td className="px-4 py-2">{item.namaPenyewa}</td>
                          <td className="px-4 py-2">{new Date(item.updatedAt).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-2 text-center">{item.jasHujan || 0}</td>
                          <td className="px-4 py-2 text-center">{item.helm || 0}</td>
                          <td className="px-4 py-2">{formatCurrency(item.totalBiaya)}</td>
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

export default FasilitasReport; 