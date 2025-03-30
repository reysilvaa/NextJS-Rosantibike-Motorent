// Export hook untuk menggunakan socket dari context provider
export { useSocket } from "../context/use-socket-provider"

// Enum untuk socket events
export enum SocketEvents {
  JOIN_ROOM = 'joinRoom',
  LEAVE_ROOM = 'leaveRoom',
  UPDATE_MOTORCYCLE = 'updateMotorcycle',
  MOTORCYCLE_UPDATED = 'motorcycleUpdated',
  TRANSACTION_CREATED = 'transactionCreated',
  TRANSACTION_UPDATED = 'transactionUpdated'
} 