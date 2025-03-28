"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/shared/date-range-picker';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { API_CONFIG } from '@/lib/api-config';
import { DateRange } from 'react-day-picker';

interface TransaksiReportItem {
  id: string;
  namaPenyewa: string;
  noWhatsapp: string;
  status: string;
  totalBiaya: number;
  tanggalMulai: string;
  tanggalSelesai: string;
  unitMotor: {
    platNomor: string;
    jenis: {
      merk: string;
      model: string;
    };
  };
}

interface TransaksiReportResponse {
  data: TransaksiReportItem[];
  total: number;
  totalTransaksi: number;
  periode: {
    mulai: string;
    selesai: string;
  };
}

export const TransaksiReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState<TransaksiReportResponse | null>(null);
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
        `${API_CONFIG.BASE_URL}/transaksi/laporan?startDate=${fromDate}&endDate=${toDate}`
      );
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data laporan');
      }
      
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching transaksi report:', error);
      toast({
        title: "Gagal mengambil laporan",
        description: "Terjadi kesalahan saat mengambil data laporan transaksi",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Laporan Transaksi</CardTitle>
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
              <div className="mb-4 flex flex-col md:flex-row md:justify-between md:items-center">
                <h3 className="text-lg font-medium">
                  Periode: {new Date(reportData.periode.mulai).toLocaleDateString('id-ID')} - {new Date(reportData.periode.selesai).toLocaleDateString('id-ID')}
                </h3>
                <div className="flex flex-col md:flex-row md:gap-4 mt-2 md:mt-0">
                  <div className="text-lg font-medium">
                    Total Transaksi: {reportData.totalTransaksi} transaksi
                  </div>
                  <div className="text-lg font-bold">
                    Total Pendapatan: {formatCurrency(reportData.total)}
                  </div>
                </div>
              </div>
              
              {reportData.data.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/10">
                  <p>Tidak ada data transaksi dalam periode ini</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-2 text-left font-medium">ID</th>
                        <th className="px-4 py-2 text-left font-medium">Nama Penyewa</th>
                        <th className="px-4 py-2 text-left font-medium">No. WhatsApp</th>
                        <th className="px-4 py-2 text-left font-medium">Motor</th>
                        <th className="px-4 py-2 text-left font-medium">Plat</th>
                        <th className="px-4 py-2 text-left font-medium">Tanggal Mulai</th>
                        <th className="px-4 py-2 text-left font-medium">Tanggal Selesai</th>
                        <th className="px-4 py-2 text-left font-medium">Status</th>
                        <th className="px-4 py-2 text-left font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.data.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="px-4 py-2">{item.id.slice(0, 8)}</td>
                          <td className="px-4 py-2">{item.namaPenyewa}</td>
                          <td className="px-4 py-2">{item.noWhatsapp}</td>
                          <td className="px-4 py-2">{item.unitMotor.jenis.merk} {item.unitMotor.jenis.model}</td>
                          <td className="px-4 py-2">{item.unitMotor.platNomor}</td>
                          <td className="px-4 py-2">{new Date(item.tanggalMulai).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-2">{new Date(item.tanggalSelesai).toLocaleDateString('id-ID')}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'SELESAI' ? 'bg-green-100 text-green-800' : 
                              item.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {item.status === 'SELESAI' ? 'Selesai' : 
                               item.status === 'ACTIVE' ? 'Aktif' : item.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-medium">{formatCurrency(item.totalBiaya)}</td>
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

export default TransaksiReport; 