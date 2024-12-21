import { io } from "socket.io-client";
import Cookies from 'js-cookie'

export const socket_io = io(import.meta.env.VITE_BASE_URL,
    {
        auth: {
            token: Cookies.get('Token')
        }
    });