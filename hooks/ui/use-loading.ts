import { useState, useCallback } from "react"

/**
 * Hook untuk mengelola state loading
 * @param initialState - Status loading awal
 * @returns Object dengan state isLoading dan fungsi untuk mengelola loading
 */
export function useLoading(initialState: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  /**
   * Mulai loading state
   */
  const startLoading = useCallback(() => {
    setIsLoading(true)
  }, [])

  /**
   * Hentikan loading state
   */
  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  /**
   * Eksekusi promise dengan mengatur loading state otomatis
   * @param promise - Promise yang akan dieksekusi
   * @returns Hasil eksekusi promise
   */
  const withLoading = useCallback(
    async <T>(promise: Promise<T>): Promise<T> => {
      try {
        startLoading()
        const result = await promise
        return result
      } finally {
        stopLoading()
      }
    },
    [startLoading, stopLoading]
  )

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
} 