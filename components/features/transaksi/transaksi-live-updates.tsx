"use client";
import { useEffect, useState } from 'react';
import { useSocketContext, SocketEvents } from '../../../contexts/socket-context';

// Interface untuk data transaksi
interface Transaksi {
  id: number;
  pelanggan: string;
  motor: string;
  status: string;
  tanggal: string;
  nominal: number;
  durasi: number;
  telah_dibayar?: boolean;
}

export const TransaksiLiveUpdates = () => {
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const { isConnected, listen } = useSocketContext();

  // Effect untuk mendengarkan transaksi baru
  useEffect(() => {
    if (!isConnected) return;

    // Handler untuk transaksi baru
    const handleNewTransaction = (data: Transaksi) => {
      setTransactions(prev => {
        // Periksa apakah transaksi sudah ada berdasarkan ID
        const exists = prev.some(item => item.id === data.id);
        if (exists) {
          // Update transaksi yang sudah ada
          return prev.map(item => item.id === data.id ? data : item);
        } else {
          // Tambahkan transaksi baru ke awal array
          return [data, ...prev].slice(0, 10); // Batasi hanya tampilkan 10 transaksi
        }
      });
    };

    // Handler untuk transaksi overdue
    const handleOverdueTransaction = (data: Transaksi) => {
      setTransactions(prev => {
        return prev.map(item => {
          if (item.id === data.id) {
            return { ...item, status: 'overdue' };
          }
          return item;
        });
      });
    };

    // Subscribe ke event
    const unsubNewTrans = listen(SocketEvents.NEW_TRANSACTION, handleNewTransaction);
    const unsubUpdate = listen(SocketEvents.UPDATE_TRANSACTION, handleNewTransaction);
    const unsubOverdue = listen(SocketEvents.OVERDUE_TRANSACTION, handleOverdueTransaction);

    // Cleanup
    return () => {
      unsubNewTrans();
      unsubUpdate();
      unsubOverdue();
    };
  }, [isConnected, listen]);

  // Format untuk nominal harga
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Transaksi Terbaru (Real-time)</h2>
        <div className="flex items-center">
          <span 
            className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
          />
          <span className="text-sm text-gray-500">
            {isConnected ? 'Terhubung' : 'Tidak terhubung'}
          </span>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">
            Belum ada transaksi baru.
            <br />
            Update akan muncul secara otomatis saat ada transaksi baru.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">ID</th>
                <th className="px-4 py-2 text-left font-medium">Pelanggan</th>
                <th className="px-4 py-2 text-left font-medium">Motor</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Nominal</th>
                <th className="px-4 py-2 text-left font-medium">Durasi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2">{item.id}</td>
                  <td className="px-4 py-2">{item.pelanggan}</td>
                  <td className="px-4 py-2">{item.motor}</td>
                  <td className="px-4 py-2">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        item.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
                        item.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
                      }`}
                    >
                      {item.status === 'active' ? 'Aktif' :
                       item.status === 'overdue' ? 'Jatuh Tempo' :
                       item.status === 'completed' ? 'Selesai' :
                       item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatCurrency(item.nominal)}</td>
                  <td className="px-4 py-2">{item.durasi} hari</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransaksiLiveUpdates; 