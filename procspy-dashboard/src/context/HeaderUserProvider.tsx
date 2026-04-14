'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { User } from "@/types/global"

interface HeaderUserContextType {
    user: User | null
    loading: boolean
}

const HeaderUserContext = createContext<HeaderUserContextType>({
    user: null,
    loading: true,
})

export const HeaderUserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/session")
                if (res.ok) {
                    const data = await res.json()
                    setUser(data.user ?? null)
                }
            } catch {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        fetchSession()
    }, [])

    return (
        <HeaderUserContext.Provider value={{ user, loading }}>
            {children}
        </HeaderUserContext.Provider>
    )
}

export const useHeaderUser = () => useContext(HeaderUserContext)
