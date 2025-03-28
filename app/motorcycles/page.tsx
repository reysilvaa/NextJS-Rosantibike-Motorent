import type { Metadata } from "next"
import MotorcyclesPageContent from "@/components/motorcycles/motorcycles-page-content"

export const metadata: Metadata = {
  title: "Koleksi Motor | MotoCruise",
  description: "Jelajahi koleksi motor premium kami yang tersedia untuk disewa",
}

export default function MotorcyclesPage() {
  return <MotorcyclesPageContent />
}

