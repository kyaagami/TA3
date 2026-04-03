'use client'
import { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import {
    CctvIcon, FlagIcon, HomeIcon, LogOutIcon, MonitorIcon,
    SettingsIcon, UserRoundPlusIcon, UserRoundSearchIcon,
    UsersRoundIcon
} from "lucide-react"
import { useModal } from "../../../context/ModalProvider"
import ConfirmModal from "../../../components/ui/ConfirmModal"
import TitleModal from "../../../components/ui/modal/TitleModal"
import BodyModal from "../../../components/ui/modal/BodyModal"

interface SideBarItemProps {
    onClick: () => void
    active: boolean
    icon: React.ElementType
    label: string
}

function SideBarItem({ onClick, active, icon: Icon, label }: SideBarItemProps) {
    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 group
                ${active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }
            `}
        >
            <Icon
                size={18}
                className={`flex-shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}
            />
            <span className="truncate">{label}</span>
        </button>
    )
}

export default function SideBar() {
    const router = useRouter()
    const { roomId } = useParams()
    const pathname = usePathname()

    const { openModal } = useModal()

    const handleRedirect = (path: string) => {
        openModal(
            <ConfirmModal
                onConfirm={() => { router.push(path) }}
                onCancel={() => {}}
            >
                <TitleModal>Are you sure want to leave?</TitleModal>
                <BodyModal>
                    <p className="text-sm dark:text-slate-300">Are you sure you want to leave proctoring mode?</p>
                </BodyModal>
            </ConfirmModal>
        )
    }

    const handleActiveToggle = (path: string) => {
        if (pathname !== path) {
            if (pathname.includes("/dashboard/room/") && !path.includes("/dashboard/room/")) {
                handleRedirect(path)
            } else {
                router.push(path)
            }
        }
    }

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

    return (
        <div className="flex flex-col w-64 h-screen bg-white border-r border-slate-100 flex-shrink-0">

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img src="/image/logo.png" alt="ProcSpy Logo" className="w-5 h-5 object-contain brightness-0 invert" />
                </div>
                <span className="font-bold text-slate-800 text-base tracking-tight">ProcSpy</span>
            </div>

            {/* Main nav */}
            <nav className="flex flex-col flex-1 px-3 py-4 gap-1 overflow-y-auto">
                <SideBarItem
                    onClick={() => handleActiveToggle('/dashboard/')}
                    active={pathname === '/dashboard' || pathname === '/dashboard/'}
                    icon={HomeIcon}
                    label="Dashboard"
                />

                {roomId ? (
                    <>
                        <SideBarItem
                            onClick={() => handleActiveToggle(`/dashboard/room/${roomId}`)}
                            active={pathname === `/dashboard/room/${roomId}`}
                            icon={MonitorIcon}
                            label="Proctoring Mode"
                        />
                        <SideBarItem
                            onClick={() => handleActiveToggle(`/dashboard/room/${roomId}/users`)}
                            active={pathname === `/dashboard/room/${roomId}/users`}
                            icon={UserRoundSearchIcon}
                            label="Participants"
                        />
                        <SideBarItem
                            onClick={() => handleActiveToggle(`/dashboard/room/${roomId}/logs`)}
                            active={pathname === `/dashboard/room/${roomId}/logs`}
                            icon={FlagIcon}
                            label="Room Logs"
                        />
                    </>
                ) : (
                    <SideBarItem
                        onClick={() => handleActiveToggle('/dashboard/room')}
                        active={pathname === '/dashboard/room'}
                        icon={CctvIcon}
                        label="Ruangan Ujian"
                    />
                )}

                <SideBarItem
                    onClick={() => handleActiveToggle('/dashboard/proctored_users')}
                    active={pathname === '/dashboard/proctored_users'}
                    icon={UsersRoundIcon}
                    label="Kelola User"
                />
            </nav>

            {/* Bottom nav */}
            <div className="flex flex-col px-3 pb-4 gap-1 border-t border-slate-100 pt-3">
                <SideBarItem
                    onClick={() => handleActiveToggle('/dashboard/proctors')}
                    active={pathname === '/dashboard/proctors'}
                    icon={UserRoundPlusIcon}
                    label="Proctor Accounts"
                />
                <SideBarItem
                    onClick={() => handleActiveToggle('/dashboard/settings')}
                    active={pathname === '/dashboard/settings'}
                    icon={SettingsIcon}
                    label="Pengaturan"
                />
                <SideBarItem
                    onClick={handleLogout}
                    active={false}
                    icon={LogOutIcon}
                    label="Log out"
                />
            </div>
        </div>
    )
}