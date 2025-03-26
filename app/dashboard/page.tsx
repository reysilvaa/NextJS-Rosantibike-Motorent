"use client";
import Link from 'next/link';
import TransaksiLiveUpdates from '../../components/features/transaksi/transaksi-live-updates';
import MotorStatusMonitor from '../../components/features/motor/motor-status-monitor';
import { useSocketContext } from '../../contexts/socket-context';

export default function DashboardPage() {
  const { isConnected } = useSocketContext();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Statistik Hari Ini</h2>
                <div className="flex items-center space-x-2">
                  <span 
                    className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
                  />
                  <span className="text-sm text-gray-500">
                    {isConnected ? 'Realtime Aktif' : 'Realtime Nonaktif'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Total Transaksi</h3>
                  <p className="text-2xl font-bold">24</p>
                </div>
                <div className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Pendapatan</h3>
                  <p className="text-2xl font-bold">Rp 2.450.000</p>
                </div>
                <div className="bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100 p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium">Motor Tersewa</h3>
                  <p className="text-2xl font-bold">18</p>
                </div>
              </div>
            </div>
            
            {/* Komponen TransaksiLiveUpdates yang memanfaatkan Socket.IO */}
            <TransaksiLiveUpdates />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="grid gap-6">
            {/* Status Motor */}
            <MotorStatusMonitor limit={3} />
          </div>
        </div>
      </div>
    </div>
  );
} 