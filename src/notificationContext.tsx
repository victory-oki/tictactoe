import { Toast } from "primereact/toast";
import React, { useContext, useRef } from "react"
import { ReactNode } from "react"

let intialValue = {} as React.RefObject<Toast>
const ToastContext = React.createContext(intialValue)

export function useToast(){
    return useContext(ToastContext)
}

export function ToastProvider({ children }: Props) {
    const toast = useRef<Toast>(null);
    return (
        <ToastContext.Provider value={toast}>
            <Toast ref={toast} />
            {children}
        </ToastContext.Provider>
    )
}

interface Props {
    children?: ReactNode
    // any props that come into the component
}
