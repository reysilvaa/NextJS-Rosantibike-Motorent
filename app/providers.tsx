"use client"

import type { ReactNode } from "react"
import { AppProviders } from "@/lib/providers"

export function Providers({ children }: { children: ReactNode }) {
  return <AppProviders>{children}</AppProviders>
}

