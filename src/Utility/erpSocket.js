// import { io } from "socket.io-client";

// let erpSocket;

// export const connectErpSocket = () => {
//     if (!erpSocket) {
//         erpSocket = io("http://192.168.1.15:8000/erp", {
//             transports: ["websocket"],
//             autoConnect: true,
//         });
//     }
//     return erpSocket;
// };

// export const disconnectErpSocket = () => {
//     if (erpSocket) {
//         erpSocket.disconnect();
//         erpSocket = null;
//     }
// };
// import { io } from "socket.io-client";

// let socket;

// export const getErpSocket = () => {
//     if (!socket) {
//         socket = io("http://192.168.1.15:8000/erp", {
//             transports: ["websocket"],
//             reconnection: true,
//             reconnectionAttempts: 5,
//             reconnectionDelay: 2000,
//         });

//         socket.on("connect", () => {
//             console.log("✅ ERP socket connected:", socket.id);
//         });

//         socket.on("disconnect", (reason) => {
//             console.log("❌ ERP socket disconnected:", reason);
//         });

//         socket.on("connect_error", (err) => {
//             console.error("🚨 ERP socket error:", err.message);
//         });
//     }

//     return socket;
// };

import { io } from "socket.io-client";

let socket;

const API_URL = process.env.REACT_APP_API_URL;

// ✅ SAFE removal of /api
const SOCKET_BASE_URL = API_URL.replace(/\/api\/?$/, '');
// const SOCKET_BASE_URL = "192.168.1.15:8000";

export const getErpSocket = () => {
    if (!socket) {
        socket = io(`${SOCKET_BASE_URL}/erp`, {
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
        });

        socket.on("connect", () => {
            console.log("✅ ERP socket connected:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            console.log("❌ ERP socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("🚨 ERP socket error:", err.message);
        });
    }

    return socket;
};
