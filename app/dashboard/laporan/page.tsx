"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransaksiReport from "@/components/features/transaksi/transaksi-report";
import DendaReport from "@/components/features/transaksi/denda-report";
import FasilitasReport from "@/components/features/transaksi/fasilitas-report";
import MotorReport from "@/components/features/motor/motor-report";

export default function LaporanPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Laporan</h1>
      
      <Tabs defaultValue="transaksi">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="transaksi">Transaksi</TabsTrigger>
          <TabsTrigger value="denda">Denda</TabsTrigger>
          <TabsTrigger value="fasilitas">Fasilitas</TabsTrigger>
          <TabsTrigger value="motor">Motor</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transaksi" className="mt-6">
          <TransaksiReport />
        </TabsContent>
        
        <TabsContent value="denda" className="mt-6">
          <DendaReport />
        </TabsContent>
        
        <TabsContent value="fasilitas" className="mt-6">
          <FasilitasReport />
        </TabsContent>
        
        <TabsContent value="motor" className="mt-6">
          <MotorReport />
        </TabsContent>
      </Tabs>
    </div>
  );
} 