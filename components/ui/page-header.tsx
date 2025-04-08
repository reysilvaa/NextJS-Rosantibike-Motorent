import { cn } from "@/lib/utils/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
  descriptionClassName?: string;
}

export function PageHeader({
  title,
  description,
  className,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-b from-accent to-background">
      <div className="container mx-auto px-4 py-20">
        <div className={cn("py-10", className)}>
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            {title}
          </h1>
          {description && (
            <p className={cn("text-foreground/75 max-w-3xl", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 
//terapkan header menjadi seperti ini
{/* <div className="container mx-auto px-4 py-20">
<div className="max-w-4xl mx-auto">
  <div className="mb-10">
    <h1 className="text-4xl font-bold mb-4">Riwayat Booking</h1>
    <p className="text-gray-400 max-w-3xl">
      Lacak dan lihat semua riwayat pemesanan motor Anda dengan mudah. Masukkan nomor telepon yang digunakan saat
      pemesanan.
    </p>
  </div> */}