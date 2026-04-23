import React, { createContext, useContext, useEffect, useState } from "react";
import { TransactionLockSettingsShow } from "../../ApiService/LoginPageService";
import { getErpSocket } from "../../Utility/erpSocket";

const ModuleLockContext = createContext([]);

export const ModuleLockProvider = ({ children }) => {
    const [moduleLocks, setModuleLocks] = useState([]);

    // 🔹 Initial API load
    useEffect(() => {
        TransactionLockSettingsShow((res) => {
            const formatted = (res.data || []).map(item => ({
                moduleName: item.moduleName,
                lockStatus: item.isLocked === 1 ? "locked" : "open",
                reason: item.reason || "",
                lockedBy: item.lockedBy || "",
            }));
            setModuleLocks(formatted);
        });
    }, []);

    // 🔹 Socket updates
    useEffect(() => {
        const socket = getErpSocket();

        const onLockUpdate = (data) => {
            if (!data?.moduleNames?.length) return;

            setModuleLocks(prev =>
                prev.map(m =>
                    data.moduleNames.includes(m.moduleName)
                        ? {
                            ...m,
                            lockStatus: data.action === "LOCK" ? "locked" : "open",
                            // reason: data.reason || "",
                            // lockedBy: data.lockedBy || "",
                            reason: data.action === "LOCK" ? data.reason || "" : "",
                            lockedBy: data.action === "LOCK" ? data.lockedBy || "" : "",
                        }
                        : m
                )
            );
        };

        socket.on("MODULE_LOCK_UPDATED", onLockUpdate);
        return () => socket.off("MODULE_LOCK_UPDATED", onLockUpdate);
    }, []);

    return (
        <ModuleLockContext.Provider value={moduleLocks}>
            {children}
        </ModuleLockContext.Provider>
    );
};

export const useModuleLocks = () => useContext(ModuleLockContext);
