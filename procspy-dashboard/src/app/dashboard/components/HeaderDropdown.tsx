'use client'

import { useRef, useState, useEffect } from "react"
import { User, Settings, Moon, Sun, HelpCircle, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import UserAvatar from "./UserAvatar"
import { useRouter } from "next/navigation"

const DUMMY_USER = {
    name: "Giri Makarim",
    email: "girimakarim55@gmail.com",
}

const HeaderDropdown = () => {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/logout', { method: 'GET' })
            localStorage.clear()
            sessionStorage.clear()
            router.refresh()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const isDark = mounted && theme === 'dark'

    const menuItems = [
        {
            icon: User,
            label: "Profil",
            onClick: () => { router.push("/dashboard/proctors"); setOpen(false) }
        },
        {
            icon: Settings,
            label: "Pengaturan",
            onClick: () => { router.push("/dashboard/settings"); setOpen(false) }
        },
        {
            icon: isDark ? Sun : Moon,
            label: isDark ? "Mode Terang" : "Mode Gelap",
            onClick: () => { setTheme(isDark ? 'light' : 'dark') }
        },
        {
            icon: HelpCircle,
            label: "Bantuan dan Dukungan",
            onClick: () => {}
        },
    ]

    return (
        <div ref={ref} className="relative">
            {/* Avatar trigger */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="
                    rounded-full ring-2 ring-transparent
                    hover:ring-[#1B2A6B] dark:hover:ring-white/40
                    transition-all duration-200 focus:outline-none
                    hover:scale-105 active:scale-95
                "
            >
                <UserAvatar name={DUMMY_USER.name} size="md" />
            </button>

            {/* Dropdown panel */}
                    {open && (
                    <div style={{animation: 'dropdownIn 0.2s ease'}} className="
                        absolute right-0 top-[calc(100%+12px)] z-50
                        w-64 rounded-2xl shadow-2xl overflow-hidden
                        bg-white dark:bg-[#0f0f13]
                        border border-gray-100 dark:border-white/10
                    ">
                    {/* User info */}
                    <div className="flex flex-col items-center gap-2 px-5 py-5 border-b border-gray-100 dark:border-white/10">
                        <p className="text-xs text-gray-400 dark:text-gray-500">{DUMMY_USER.email}</p>
                        <div className="transition-transform duration-200 hover:scale-105">
                            <UserAvatar name={DUMMY_USER.name} size="md" />
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm">{DUMMY_USER.name}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                        {menuItems.map(({ icon: Icon, label, onClick }) => (
                            <button
                                key={label}
                                onClick={onClick}
                                className="
                                    w-full flex items-center gap-3 px-5 py-2.5 text-sm
                                    text-gray-700 dark:text-gray-300
                                    hover:bg-gray-50 dark:hover:bg-white/5
                                    transition-colors duration-150
                                    group
                                "
                            >
                                <Icon size={16} className="text-gray-400 dark:text-gray-500 shrink-0 group-hover:text-[#1B2A6B] dark:group-hover:text-white transition-colors duration-150" />
                                {label}
                            </button>
                        ))}

                        <div className="my-1 border-t border-gray-100 dark:border-white/10" />

                        <button
                            onClick={handleLogout}
                            className="
                                w-full flex items-center gap-3 px-5 py-2.5 text-sm
                                text-red-500
                                hover:bg-red-50 dark:hover:bg-red-500/10
                                transition-colors duration-150
                                group
                            "
                        >
                            <LogOut size={16} className="shrink-0 group-hover:translate-x-0.5 transition-transform duration-150" />
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HeaderDropdown