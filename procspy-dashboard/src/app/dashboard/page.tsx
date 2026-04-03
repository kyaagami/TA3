'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    DoorOpen,
    Users,
    ShieldCheck,
    MonitorPlay,
    PlusCircle,
    UsersRound,
    ChevronRight,
    RefreshCw,
    Settings,
    CalendarClock,
    UserCircle2
} from "lucide-react"
import session from "../../lib/session"

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT || 'https://0.0.0.0:5050'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Room {
    id: string
    roomId: string
    participants?: Participant[]
    status?: string
    createdAt?: string
}

interface Participant {
    id: string
    name?: string
    userId?: string
}

interface Stats {
    totalRooms: number
    activeRooms: number
    totalParticipants: number
    onlineProctors: number
}

interface ActivityItem {
    id: string
    type: 'settings' | 'event' | 'profile' | 'room'
    title: string
    description: string
    time: string
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function fetchWithAuth(path: string) {
    const token = await session()
    const res = await fetch(`${ENDPOINT}${path}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error(`Failed to fetch ${path}`)
    return res.json()
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
    icon: Icon,
    label,
    value,
    color,
}: {
    icon: React.ElementType
    label: string
    value: number | string
    color: string
}) {
    return (
        <div className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon size={22} className="text-indigo-600" />
            </div>
            <div>
                <p className="text-xs text-slate-400 font-medium">{label}</p>
                <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
            </div>
        </div>
    )
}

function ActionCard({
    icon: Icon,
    title,
    description,
    buttonLabel,
    onClick,
}: {
    icon: React.ElementType
    title: string
    description: string
    buttonLabel: string
    onClick: () => void
}) {
    return (
        <div className="flex flex-col items-center text-center gap-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <Icon size={26} className="text-slate-500" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 text-base">{title}</h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{description}</p>
            </div>
            <button
                onClick={onClick}
                className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-sm font-semibold rounded-xl py-2.5 px-4"
            >
                {buttonLabel}
            </button>
        </div>
    )
}

function ActivityIcon({ type }: { type: ActivityItem['type'] }) {
    const map = {
        settings: { bg: 'bg-blue-100', icon: Settings, color: 'text-blue-500' },
        event:    { bg: 'bg-pink-100',  icon: CalendarClock, color: 'text-pink-500' },
        profile:  { bg: 'bg-purple-100',icon: UserCircle2,   color: 'text-purple-500' },
        room:     { bg: 'bg-green-100', icon: DoorOpen,      color: 'text-green-500' },
    }
    const { bg, icon: Icon, color } = map[type] ?? map.settings
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
            <Icon size={18} className={color} />
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Page() {
    const router = useRouter()

    const [rooms, setRooms]           = useState<Room[]>([])
    const [stats, setStats]           = useState<Stats>({ totalRooms: 0, activeRooms: 0, totalParticipants: 0, onlineProctors: 0 })
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isLoading, setIsLoading]   = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError]           = useState<string | null>(null)

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setIsRefreshing(true)
        else setIsLoading(true)
        setError(null)

        try {
            // 1. Fetch rooms
            const roomsData  = await fetchWithAuth('/api/rooms')
            const roomList: Room[] = roomsData.data || []
            setRooms(roomList)

            // 2. Calculate stats from rooms
            const totalParticipants = roomList.reduce((acc, room) => acc + (room.participants?.length || 0), 0)
            const activeRooms = roomList.filter(r => r.status === 'active' || (r.participants?.length ?? 0) > 0).length

            // 3. Try fetch proctors count — graceful fallback
            let proctorCount = 0
            try {
                const proctorsData = await fetchWithAuth('/api/proctors')
                proctorCount = (proctorsData.data || proctorsData || []).length
            } catch (_) {}

            setStats({ totalRooms: roomList.length, activeRooms, totalParticipants, onlineProctors: proctorCount })

            // 4. Try fetch activity logs — fallback to room list
            try {
                const logsData = await fetchWithAuth('/api/logs')
                const logList  = logsData.data || logsData || []
                setActivities(logList.slice(0, 5).map((log: any) => ({
                    id:          log._id || log.id || String(Math.random()),
                    type:        log.type || 'settings',
                    title:       log.title || log.action || 'Activity',
                    description: log.description || log.detail || '',
                    time:        log.createdAt
                                    ? new Date(log.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                    : '',
                })))
            } catch (_) {
                // Use rooms as activity fallback
                setActivities(roomList.slice(0, 4).map((r, i) => ({
                    id:          r.id || String(i),
                    type:        'room',
                    title:       r.roomId,
                    description: `${r.participants?.length || 0} peserta terhubung`,
                    time:        r.createdAt
                                    ? new Date(r.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                                    : '',
                })))
            }
        } catch (e: any) {
            setError('Gagal memuat data. Pastikan server backend berjalan.')
            console.error(e)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    useEffect(() => {
        loadData()
        // Auto-refresh setiap 30 detik
        const interval = setInterval(() => loadData(true), 30_000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 bg-white flex items-center justify-between">
                <h1 className="font-bold text-2xl text-slate-800">Dashboard Utama</h1>
                {/* <button
                    onClick={() => loadData(true)}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded-lg px-3 py-1.5 disabled:opacity-50"
                >
                    <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                    Refresh
                </button> */}
            </div>

            <div className="flex-1 p-8 space-y-6 w-full">

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                {/* ── Stats ── */}
                {isLoading ? (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 h-24 animate-pulse border border-slate-100" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                        <StatCard icon={DoorOpen}   label="Total Ruangan"    value={stats.totalRooms}        color="bg-indigo-50" />
                        <StatCard icon={MonitorPlay} label="Ujian Aktif"      value={stats.activeRooms}       color="bg-indigo-50" />
                        <StatCard icon={Users}       label="Total Peserta"    value={stats.totalParticipants} color="bg-indigo-50" />
                        <StatCard icon={ShieldCheck} label="Pengawas Online"  value={stats.onlineProctors}    color="bg-indigo-50" />
                    </div>
                )}

                {/* ── Action Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <ActionCard
                        icon={DoorOpen}
                        title="Pilih Ruangan"
                        description="Masuk ke ruangan ujian yang sedang berlangsung untuk memulai pengawasan"
                        buttonLabel="Lihat Ruangan"
                        onClick={() => router.push('/dashboard/room')}
                    />
                    <ActionCard
                        icon={PlusCircle}
                        title="Buat Ruangan"
                        description="Buat ruangan ujian baru dan atur konfigurasi pengawasan"
                        buttonLabel="Buat Ruangan"
                        onClick={() => router.push('/dashboard/room')}
                    />
                    <ActionCard
                        icon={UsersRound}
                        title="Kelola User"
                        description="Tambah, edit, atau hapus akun peserta dan pengawas ujian"
                        buttonLabel="Kelola User"
                        onClick={() => router.push('/dashboard/proctored_users')}
                    />
                </div>

                {/* ── Active Rooms + Activity ── */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

                    {/* Active Rooms */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <h2 className="font-bold text-slate-800 text-base mb-4">Ruangan Aktif</h2>

                        {isLoading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                                ))}
                            </div>
                        ) : rooms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <DoorOpen size={32} className="mb-2 opacity-40" />
                                <p className="text-sm">Tidak ada ruangan aktif</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-700 text-sm">{room.roomId}</p>
                                            <p className="text-xs text-slate-400">
                                                {room.participants?.length || 0} peserta
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/dashboard/room/${room.roomId}`)}
                                            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-white text-xs font-semibold rounded-lg px-3 py-1.5 flex items-center gap-1"
                                        >
                                            Lihat <ChevronRight size={13} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Activity */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <h2 className="font-bold text-slate-800 text-base mb-4">Aktifitas Terbaru</h2>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
                                        <div className="flex-1 space-y-2">
                                            <div className="h-3 bg-slate-100 rounded animate-pulse w-2/3" />
                                            <div className="h-2.5 bg-slate-100 rounded animate-pulse w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <CalendarClock size={32} className="mb-2 opacity-40" />
                                <p className="text-sm">Belum ada aktifitas</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-3">
                                        <ActivityIcon type={activity.type} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{activity.title}</p>
                                            <p className="text-xs text-slate-400 truncate">{activity.description}</p>
                                        </div>
                                        <span className="text-xs text-slate-400 flex-shrink-0">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}