"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/shared/date-range-picker';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/lib/api-config';

interface DendaReportItem {
  id: string;
  namaPenyewa: string;
  biayaDenda: number;
  unitMotor: {
    platNomor: string;
    jenis: {
      merk: string;
      model: string;
    };
  };
  updatedAt: string;
}

interface DendaReportResponse {
  data: DendaReportItem[];
  totalDenda: number;
  periode: {
    mulai: string;
    selesai: string;
  };
}

export const DendaReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<DendaReportResponse | null>(null);
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
        `${API_CONFIG.BASE_URL}/transaksi/laporan/denda?startDate=${fromDate}&endDate=${toDate}`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data laporan');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching denda report:', error);
      toast({
        title: "Gagal mengambil laporan",
        description: "Terjadi kesalahan saat mengambil data laporan denda",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Laporan Denda Keterlambatan</CardTitle>
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
                  Total Denda: {formatCurrency(reportData.totalDenda)}
                </div>
              </div>
              
              {reportData.data.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/10">
                  <p>Tidak ada data denda dalam periode ini</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">ID Transaksi</th>
                        <th className="px-4 py-2 text-left font-medium">Nama Penyewa</th>
                        <th className="px-4 py-2 text-left font-medium">Motor</th>
                        <th className="px-4 py-2 text-left font-medium">Plat Nomor</th>
                        <th className="px-4 py-2 text-left font-medium">Tanggal</th>
                        <th className="px-4 py-2 text-left font-medium">Denda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2">{item.id}</td>
                          <td className="px-4 py-2">{item.namaPenyewa}</td>
                          <td className="px-4 py-2">{item.unitMotor.jenis.merk} {item.unitMotor.jenis.model}</td>
                          <td className="px-4 py-2">{item.unitMotor.platNomor}</td>
                          <td className="px-4 py-2">{new Date(item.updatedAt).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-2 font-medium text-red-600">{formatCurrency(item.biayaDenda)}</td>
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

export default DendaReport; 