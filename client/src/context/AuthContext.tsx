// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    username: string;
    role: "admin" | "user";
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("user") || "null")
    );

    const login = (user: User) => {
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
