"use client";

import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://202.10.34.67:3000/mediasoup");