"use client"

import { useState, useEffect } from "react"

/**
 * Hook untuk mendeteksi ukuran layar mobile
 * @param breakpoint - Ukuran breakpoint untuk menentukan mobile (default: 768px)
 * @returns Boolean apakah layar mobile
 */
export function useMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Fungsi untuk mengecek ukuran layar
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check on mount
    checkIsMobile()

    // Tambahkan event listener untuk resize
    window.addEventListener("resize", checkIsMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [breakpoint])

  return isMobile
} 