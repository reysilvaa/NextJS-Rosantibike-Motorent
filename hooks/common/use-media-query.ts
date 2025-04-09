"use client"

import { useState, useEffect } from "react"

// Import ENDPOINTS if this file directly makes API calls
// Add the import if it's needed for direct API calls

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Initial check
    setMatches(media.matches)
    
    // Update matches when media query changes
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    media.addEventListener("change", listener)
    
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [query])

  return matches
} 