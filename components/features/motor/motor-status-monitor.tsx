"use client";
import { useEffect, useState } from 'react';
import { useSocketContext, SocketEvents } from '../../../contexts/socket-context';

// Interface untuk data motor
interface Motor {
  id: number;
  plat_nomor: string;
  jenis: string;
  status: 'tersedia' | 'disewa' | 'maintenance' | 'offline';
  lastUpdate?: string;
  lokasi?: {
    lat: number;
    lng: number;
    address?: string;
  };
}

interface MotorStatusMonitorProps {
  limit?: number;
  showLocation?: boolean;
}

export const MotorStatusMonitor: React.FC<MotorStatusMonitorProps> = ({ 
  limit = 5,
  showLocation = false
}) => {
  const [motors, setMotors] = useState<Motor[]>([]);
  const { isConnected, listen } = useSocketContext();

  // Effect untuk mendengarkan update status motor
  useEffect(() => {
    if (!isConnected) return;

    // Handler untuk update status motor
    const handleStatusUpdate = (data: Motor) => {
      setMotors(prev => {
        // Periksa apakah motor sudah ada
        const exists = prev.some(item => item.id === data.id);
        
        if (exists) {
          // Update motor yang sudah ada
          return prev.map(item => 
            item.id === data.id 
              ? { ...item, ...data, lastUpdate: new Date().toISOString() } 
              : item
          );
        } else {
          // Tambahkan motor baru (dengan lastUpdate)
          const updated = [
            { ...data, lastUpdate: new Date().toISOString() },
            ...prev
          ];
          
          // Batasi jumlah motor yang ditampilkan
          return updated.slice(0, limit);
        }
      });
    };

    // Handler untuk update lokasi motor
    const handleLocationUpdate = (data: { id: number; lat: number; lng: number; address?: string; }) => {
      if (!showLocation) return;
      
      setMotors(prev => {
        return prev.map(item => {
          if (item.id === data.id) {
            return { 
              ...item, 
              lokasi: {
                lat: data.lat,
                lng: data.lng,
                address: data.address
              },
              lastUpdate: new Date().toISOString()
            };
          }
          return item;
        });
      });
    };

    // Subscribe ke event
    const unsubStatus = listen(SocketEvents.MOTOR_STATUS_UPDATE, handleStatusUpdate);
    const unsubLocation = listen(SocketEvents.MOTOR_LOCATION_UPDATE, handleLocationUpdate);

    // Cleanup
    return () => {
      unsubStatus();
      unsubLocation();
    };
  }, [isConnected, listen, limit, showLocation]);

  // Format waktu terakhir update
  const formatLastUpdate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit yang lalu`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari yang lalu`;
  };

  return (
    <div className="rounded-md border">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-medium">Status Motor (Real-time)</h2>
        <div className="flex items-center">
          <span 
            className={`h-3 w-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
          />
          <span className="text-sm text-gray-500">
            {isConnected ? 'Terhubung' : 'Tidak terhubung'}
          </span>
        </div>
      </div>
      
      {motors.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">
            Belum ada update status motor.
            <br />
            Status akan muncul secara otomatis saat ada perubahan.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-2 text-left font-medium">Plat Nomor</th>
                <th className="px-4 py-2 text-left font-medium">Jenis</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                {showLocation && (
                  <th className="px-4 py-2 text-left font-medium">Lokasi</th>
                )}
                <th className="px-4 py-2 text-left font-medium">Terakhir Update</th>
              </tr>
            </thead>
            <tbody>
              {motors.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2">{item.plat_nomor}</td>
                  <td className="px-4 py-2">{item.jenis}</td>
                  <td className="px-4 py-2">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'tersedia' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                        item.status === 'disewa' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                        item.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                        'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}
                    >
                      {item.status === 'tersedia' ? 'Tersedia' :
                       item.status === 'disewa' ? 'Disewa' :
                       item.status === 'maintenance' ? 'Maintenance' :
                       'Offline'}
                    </span>
                  </td>
                  {showLocation && (
                    <td className="px-4 py-2">
                      {item.lokasi ? (
                        <span className="text-xs">
                          {item.lokasi.address || `${item.lokasi.lat.toFixed(4)}, ${item.lokasi.lng.toFixed(4)}`}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Tidak tersedia</span>
                      )}
                    </td>
                  )}
                  <td className="px-4 py-2 text-gray-500">
                    {item.lastUpdate ? formatLastUpdate(item.lastUpdate) : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MotorStatusMonitor; 