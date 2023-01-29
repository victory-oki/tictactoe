import React, { ReactNode, useContext} from 'react';
import { io, Socket } from "socket.io-client";
const port = 3001;
const url= process.env.NODE_ENV==='test'?'':`http://${process.env.REACT_APP_HOST_NAME ?? 'localhost'}:${port}`;
console.log(process.env);
const socket: Socket = io(url);
const SocketContext = React.createContext(socket);

export function useSocket(){
    return useContext(SocketContext)
}

export function SocketProvider({ children }: Props) {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

interface Props {
    children?: ReactNode
    // any props that come into the component
}
