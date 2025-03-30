"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
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

/**
 * Provider untuk koneksi Socket.io
 * @param children - React children nodes
 * @returns SocketProvider component
 */
export function SocketProvider({ children, defaultRooms }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<string | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)
  const maxConnectionAttempts = 3

  // Fungsi untuk membuat koneksi socket
  const connect = () => {
    if (socket) return // Jangan buat koneksi baru jika sudah ada

    try {
      console.log("Membuat koneksi socket ke:", SOCKET_URL)
      const socketInstance = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
        autoConnect: true
      })

      setSocket(socketInstance)

      // Event handlers
      socketInstance.on("connect", () => {
        console.log("Socket terhubung:", socketInstance.id)
        setIsConnected(true)
        setConnectionAttempts(0)
        
        toast({
          title: "Terhubung",
          description: "Koneksi real-time aktif",
        })
      })

      socketInstance.on("disconnect", (reason) => {
        console.log("Socket terputus:", reason)
        setIsConnected(false)
        
        if (reason !== "io client disconnect") {
          toast({
            title: "Terputus",
            description: "Koneksi real-time terputus",
            variant: "destructive"
          })
        }
      })

      socketInstance.on("connect_error", (error) => {
        console.error("Socket error:", error)
        setConnectionAttempts(prev => prev + 1)
        
        if (connectionAttempts >= maxConnectionAttempts) {
          toast({
            title: "Masalah Koneksi",
            description: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
            variant: "destructive"
          })
          socketInstance.disconnect()
        }
      })
    } catch (error) {
      console.error("Error membuat koneksi socket:", error)
      toast({
        title: "Error",
        description: "Gagal membuat koneksi real-time",
        variant: "destructive"
      })
    }
  }

  // Bersihkan koneksi socket saat komponen unmount
  useEffect(() => {
    // Koneksi otomatis saat provider dimuat
    connect()

    // Gabung ke default rooms jika ada
    if (defaultRooms && defaultRooms.length > 0 && socket && isConnected) {
      console.log('Joining default rooms:', defaultRooms);
      defaultRooms.forEach(room => joinRoom(room));
    }

    return () => {
      if (socket) {
        // Tinggalkan default rooms jika ada
        if (defaultRooms && defaultRooms.length > 0) {
          defaultRooms.forEach(room => leaveRoom(room));
        }
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [socket, isConnected, defaultRooms]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fungsi untuk disconnect
  const disconnect = () => {
    if (socket) {
      socket.disconnect()
      // Tidak perlu setSocket(null) di sini karena event 'disconnect' akan diproses
    }
  }

  // Fungsi untuk join room
  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      // Tinggalkan room saat ini jika ada
      if (currentRoom) {
        socket.emit("leaveRoom", { roomId: currentRoom })
      }
      
      // Join room baru
      socket.emit("joinRoom", { roomId })
      setCurrentRoom(roomId)
      console.log(`Joined room: ${roomId}`)
    } else {
      console.warn("Tidak dapat join room: socket tidak terhubung")
    }
  }

  // Fungsi untuk leave room
  const leaveRoom = (roomId: string) => {
    if (socket && isConnected && currentRoom === roomId) {
      socket.emit("leaveRoom", { roomId })
      setCurrentRoom(null)
      console.log(`Left room: ${roomId}`)
    }
  }

  // Fungsi untuk listen event
  const listenToEvent = <T,>(event: string, callback: (data: T) => void) => {
    if (socket) {
      socket.on(event, callback)
      console.log(`Listening to event: ${event}`)
    }
  }

  // Fungsi untuk stop listening event
  const stopListeningToEvent = (event: string) => {
    if (socket) {
      socket.off(event)
      console.log(`Stopped listening to event: ${event}`)
    }
  }

  // Fungsi untuk emit event
  const emitEvent = <T,>(event: string, data: T) => {
    if (socket && isConnected) {
      socket.emit(event, data)
      console.log(`Emitted event: ${event}`, data)
    } else {
      console.warn(`Tidak dapat emit event ${event}: socket tidak terhubung`)
    }
  }

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