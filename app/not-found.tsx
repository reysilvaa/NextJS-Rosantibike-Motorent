import Link from "next/link";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-gradient-to-b from-accent to-background min-h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-6">
          <div className="flex justify-center">
            <div className="bg-secondary/70 p-6 rounded-full">
              <AlertTriangle className="h-16 w-16 text-foreground" />
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-5xl font-bold mb-4 text-foreground">404</h1>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">
            Halaman tidak ditemukan
          </h2>
          <p className="text-foreground/75 mb-8 max-w-md mx-auto">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. Halaman mungkin telah dipindahkan atau dihapus.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Kembali ke Beranda</span>
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4" />
                <span>Kembali ke Halaman Sebelumnya</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 