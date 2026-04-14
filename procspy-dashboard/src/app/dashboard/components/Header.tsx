'use client'

import NotificationBell from "./NotificationBell"
import HeaderDropdown from "./HeaderDropdown"

const Header = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="w-full px-8 border-b dark:border-white/10 border-gray-200 h-[64px] flex justify-between items-center bg-white dark:bg-[#0f0f13] sticky top-0 z-40 transition-colors duration-300 flex-shrink-0">
            {/* Logo kiri */}
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1B2A6B] dark:bg-[#3d4f9e] flex items-center justify-center text-white font-bold text-sm select-none transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-[#1B2A6B]/30">
                    PS
                </div>
                <span className="font-bold text-[#1B2A6B] dark:text-white text-xl transition-colors duration-300">
                    ProcSpy
                </span>
            </div>

            {/* Children (breadcrumb dll) */}
            {children && (
                <div className="flex-1 flex items-center justify-center">
                    {children}
                </div>
            )}

            {/* Kanan: notif + avatar */}
            <div className="flex items-center gap-1">
                <NotificationBell />
                <HeaderDropdown />
            </div>
        </div>
    )
}

export default Header