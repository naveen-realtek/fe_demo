import React, { createContext, useContext, useState } from "react";

const AdminViewProviderContext = createContext();
export const useAdminViewProvider = () => useContext(AdminViewProviderContext);

export function AdminViewProvider({ children }) {
    const [view, setAdminView] = useState("card");
    const updateAdminView = (AdminView) => {
        setAdminView(AdminView);
    }

    const value = {
        view, updateAdminView
    }

    return (
        <AdminViewProviderContext.Provider value={value}>
            {children}
        </AdminViewProviderContext.Provider>
    );
}

export default AdminViewProvider;
