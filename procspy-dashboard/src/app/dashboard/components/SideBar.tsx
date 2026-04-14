'use client'
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
                flex items-center gap-4 w-[198px] px-5 py-4 rounded-2xl text-base font-medium mx-auto
                transition-all duration-200 group
                ${active
                    ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/25'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }
            `}
        >
            <Icon
                size={20}
                className={`
                    flex-shrink-0 transition-all duration-200
                    ${active
                        ? 'text-white'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-[#4F46E5] dark:group-hover:text-white group-hover:scale-110'
                    }
                `}
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
        <div className="
            flex flex-col w-64 h-full flex-shrink-0
            bg-white dark:bg-[#111318]
            border-r border-black/5 dark:border-white/5
            transition-colors duration-300
        ">
            {/* Main nav */}
            <nav className="flex flex-col flex-1 px-3 py-4 gap-1">
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

            {/* Divider */}
            <div className="mx-4 border-t border-black/5 dark:border-white/5" />

            {/* Bottom nav */}
            <div className="flex flex-col px-3 py-4 gap-1">
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