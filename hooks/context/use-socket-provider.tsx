"use client"

import React, { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from "react"
import { Socket, io } from "socket.io-client"
import { toast } from "../ui/use-toast"

// Tipe untuk SocketContext
interface SocketContextValue {
  socket: Socket | null
  isConnected: boolean
  connect: () => void
  disconnect: () => void
  joinRoom: (roomId: string) => void
  leaveRoom: (roomId: string) => void
  listenToEvent: <T>(event: string, callback: (data: T) => void) => void
  stopListeningToEvent: (event: string) => void
  emitEvent: <T>(event: string, data: T) => void
  currentRoom: string | null
}

// Prop untuk SocketProvider
interface SocketProviderProps {
  children: ReactNode
  defaultRooms?: string[]
}

// Membuat context dengan nilai default
const SocketContext = createContext<SocketContextValue | undefined>(undefined)

// URL socket.io
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.rosantibikemotorent.com"

// Pilihan koneksi socket dengan timeout yang lebih kecil dan polling sederhana
const socketOptions = {
  transports: ["websocket", "polling"],
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  timeout: 5000, // Lebih cepat timeout
  autoConnect: false, // Tidak otomatis connect
  forceNew: true, // Selalu buat koneksi baru
  reconnection: true,
  query: {
    clientType: 'web'
  }
}

/**
 * Provider untuk koneksi Socket.io
 * @param children - React children nodes
 * @returns SocketProvider component
 */
export function SocketProvider({ children, defaultRooms }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const connectionAttemptsRef = useRef(0)
  const maxConnectionAttempts = 2
  const socketRef = useRef<Socket | null>(null)
  const hasConnectedBefore = useRef(false)
  
  // Gunakan debounce untuk toast notification
  const [toastDebounce, setToastDebounce] = useState(false)
  
  // Fungsi untuk membuat koneksi socket dengan useCallback
  const connect = useCallback(() => {
    // Jika sudah ada socket yang terhubung, jangan buat yang baru
    if (socketRef.current?.connected) return
    
    // Bersihkan socket lama jika ada
    if (socketRef.current) {
      socketRef.current.removeAllListeners()
      socketRef.current.disconnect()
    }

    try {
      // Buat instance socket baru
      const socketInstance = io(SOCKET_URL, socketOptions)
      socketRef.current = socketInstance
      
      // Update state saat socket dibuat
      setSocket(socketInstance)

      // Connect secara manual
      socketInstance.connect()

      // Event handlers
      socketInstance.on("connect", () => {
        setIsConnected(true)
        connectionAttemptsRef.current = 0
        hasConnectedBefore.current = true
        
        // Kurangi notifikasi yang berlebihan
        if (!toastDebounce) {
          setToastDebounce(true)
          toast({
            title: "Terhubung",
            description: "Koneksi real-time aktif",
          })
          
          // Reset debounce setelah 10 detik
          setTimeout(() => setToastDebounce(false), 10000)
        }
      })

      socketInstance.on("disconnect", (reason) => {
        setIsConnected(false)
        
        // Hanya tampilkan toast untuk disconnect yang tidak diinginkan
        if (reason !== "io client disconnect" && reason !== "transport close" && hasConnectedBefore.current && !toastDebounce) {
          setToastDebounce(true)
          toast({
            title: "Terputus",
            description: "Koneksi real-time terputus",
            variant: "destructive"
          })
          
          // Reset debounce setelah 10 detik
          setTimeout(() => setToastDebounce(false), 10000)
        }
      })

      socketInstance.on("connect_error", (error) => {
        connectionAttemptsRef.current += 1
        
        // Hanya coba beberapa kali sebelum menyerah
        if (connectionAttemptsRef.current >= maxConnectionAttempts) {
          // Matikan koneksi setelah beberapa percobaan gagal
          socketInstance.disconnect()
          
          // Hanya tampilkan pesan error jika user sudah terhubung sebelumnya
          if (hasConnectedBefore.current && !toastDebounce) {
            setToastDebounce(true)
            toast({
              title: "Masalah Koneksi",
              description: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
              variant: "destructive"
            })
            
            // Reset debounce setelah 10 detik
            setTimeout(() => setToastDebounce(false), 10000)
          }
        }
      })
    } catch (error) {
      // Hanya tampilkan error jika user sudah terhubung sebelumnya
      if (hasConnectedBefore.current && !toastDebounce) {
        setToastDebounce(true)
        toast({
          title: "Error",
          description: "Gagal membuat koneksi real-time",
          variant: "destructive"
        })
        
        // Reset debounce setelah 10 detik
        setTimeout(() => setToastDebounce(false), 10000)
      }
    }
  }, [toastDebounce])

  // Connect saat komponen mount
  useEffect(() => {
    // Delay koneksi untuk mengurangi beban saat halaman di-load
    const connectTimer = setTimeout(() => {
      // Hanya connect jika tidak ada koneksi yang aktif
      if (!socketRef.current?.connected) {
        connect()
      }
    }, 1500) // Delay koneksi untuk 1.5 detik
    
    // Cleanup
    return () => {
      clearTimeout(connectTimer)
      
      // Gunakan ref untuk menghindari memory leak
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [connect])

  // Gabung default rooms setelah terhubung
  useEffect(() => {
    if (isConnected && socket && defaultRooms && defaultRooms.length > 0) {
      defaultRooms.forEach(room => joinRoom(room))
    }
    
    // Cleanup - tinggalkan rooms saat unmount
    return () => {
      if (isConnected && socket && defaultRooms && defaultRooms.length > 0) {
        defaultRooms.forEach(room => {
          if (currentRoom === room) {
            socket.emit("leaveRoom", { roomId: room })
          }
        })
      }
    }
  }, [isConnected, socket, defaultRooms]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fungsi untuk disconnect
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }, [])

  // Fungsi untuk join room
  const joinRoom = useCallback((roomId: string) => {
    if (!socketRef.current || !isConnected) return
    
    try {
      // Tinggalkan room saat ini jika ada
      if (currentRoom) {
        socketRef.current.emit("leaveRoom", { roomId: currentRoom })
      }
      
      // Join room baru
      socketRef.current.emit("joinRoom", { roomId })
      setCurrentRoom(roomId)
    } catch (error) {
      // Tangani error dalam diam
    }
  }, [isConnected, currentRoom])

  // Fungsi untuk leave room
  const leaveRoom = useCallback((roomId: string) => {
    if (!socketRef.current || !isConnected || currentRoom !== roomId) return
    
    try {
      socketRef.current.emit("leaveRoom", { roomId })
      setCurrentRoom(null)
    } catch (error) {
      // Tangani error dalam diam
    }
  }, [isConnected, currentRoom])

  // Fungsi untuk listen event
  const listenToEvent = useCallback(<T,>(event: string, callback: (data: T) => void) => {
    if (!socketRef.current) return
    
    try {
      socketRef.current.on(event, callback)
    } catch (error) {
      // Tangani error dalam diam
    }
  }, [])

  // Fungsi untuk stop listening event
  const stopListeningToEvent = useCallback((event: string) => {
    if (!socketRef.current) return
    
    try {
      socketRef.current.off(event)
    } catch (error) {
      // Tangani error dalam diam
    }
  }, [])

  // Fungsi untuk emit event
  const emitEvent = useCallback(<T,>(event: string, data: T) => {
    if (!socketRef.current || !isConnected) return
    
    try {
      socketRef.current.emit(event, data)
    } catch (error) {
      // Tangani error dalam diam
    }
  }, [isConnected])

  // Nilai context
  const contextValue: SocketContextValue = {
    socket,
    isConnected,
    connect,
    disconnect,
    joinRoom,
    leaveRoom,
    listenToEvent,
    stopListeningToEvent,
    emitEvent,
    currentRoom
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}

/**
 * Hook untuk menggunakan SocketContext
 * @returns Socket context values
 * @throws Error jika digunakan di luar SocketProvider
 */
export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
} 