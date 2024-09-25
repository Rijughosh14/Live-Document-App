import { io } from "socket.io-client";

export const socket_io = io(import.meta.env.VITE_BASE_URL);

