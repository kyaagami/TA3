'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DoorOpen, Plus, Users, AlertTriangle, Wifi, WifiOff, Activity } from "lucide-react"
import session from "../../lib/session"

type Room = {
    id: string
    roomId: string
    title?: string
}

type Log = {
    id: string
    flagKey: string
    logType: string
    timestamp: string
    flag?: {
        label: string
        severity: number
    }
    session?: {
        roomId: string
        token: string
    }
}

const getSeverityColor = (severity: number) => {
    if (severity >= 3) return "bg-red-400"
    if (severity === 2) return "bg-amber-400"
    return "bg-blue-400"
}

const getSeverityIcon = (severity: number) => {
    if (severity >= 3) return <AlertTriangle size={14} />
    if (severity === 2) return <Activity size={14} />
    return <Wifi size={14} />
}

const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export default function Page() {
    const router = useRouter()
    const [rooms, setRooms] = useState<Room[]>([])
    const [logs, setLogs] = useState<Log[]>([])
    const [loadingRooms, setLoadingRooms] = useState(true)
    const [loadingLogs, setLoadingLogs] = useState(true)

    const fetchRooms = async () => {
        try {
            const token = await session()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/rooms?page=1&paginationLimit=10`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const data = await res.json()
            if (res.ok) setRooms(data.data)
        } catch (err) {
            console.error("Failed to fetch rooms", err)
        } finally {
            setLoadingRooms(false)
        }
    }

    const fetchLogs = async () => {
        try {
            const token = await session()
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/logs-recent?limit=8`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            const data = await res.json()
            if (res.ok) setLogs(data)
        } catch (err) {
            console.error("Failed to fetch logs", err)
        } finally {
            setLoadingLogs(false)
        }
    }

    useEffect(() => {
        fetchRooms()
        fetchLogs()
        const roomInterval = setInterval(fetchRooms, 10000)
        const logInterval = setInterval(fetchLogs, 5000)
        return () => {
            clearInterval(roomInterval)
            clearInterval(logInterval)
        }
    }, [])

    return (
        <div className="p-8 min-h-full bg-[#F7F8FA] dark:bg-transparent transition-colors duration-300">

            {/* Title */}
            <h1 className="font-bold text-2xl text-slate-800 dark:text-white mb-6">
                Dashboard Utama
            </h1>

            {/* Top cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Pilih Ruangan */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-white/10 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <DoorOpen size={28} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    <p className="font-bold text-[#4F46E5] text-lg">Pilih Ruangan</p>
                    <p className="text-sm text-slate-400 text-center max-w-[300px]">
                        Masuk ke ruangan ujian yang sedang berlangsung untuk memulai pengawasan
                    </p>
                    <button
                        onClick={() => router.push('/dashboard/room')}
                        className="w-full mt-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                    >
                        Lihat Ruangan
                    </button>
                </div>

                {/* Buat Ruangan */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-white/10 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <Plus size={28} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    <p className="font-bold text-[#4F46E5] text-base">Buat Ruangan</p>
                    <p className="text-sm text-slate-400 text-center">
                        Buat ruangan ujian baru dan atur konfigurasi pengawasan
                    </p>
                    <button className="w-full mt-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95">
                        Buat Ruangan
                    </button>
                </div>

                {/* Kelola User */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 flex flex-col items-center gap-3 border border-slate-100 dark:border-white/10 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                        <Users size={28} className="text-slate-500 dark:text-slate-300" />
                    </div>
                    <p className="font-bold text-[#4F46E5] text-base">Kelola User</p>
                    <p className="text-sm text-slate-400 text-center">
                        Tambah, edit, atau hapus akun peserta dan pengawas ujian
                    </p>
                    <button onClick={() => router.push('/dashboard/proctored_users')}
                        className="w-full mt-auto bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95">
                        Kelola User
                    </button>
                </div>
            </div>

            {/* Bottom section */}
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 400px' }}>

                {/* Ruangan Aktif */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/10 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-800 dark:text-white text-base">Ruangan Aktif</h2>
                    </div>

                    {loadingRooms ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            Tidak ada ruangan aktif
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {rooms.map(room => (
                                <div
                                    key={room.id}
                                    className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-[#4F46E5]/30 transition-all duration-200"
                                >
                                    <div>
                                        <p className="font-semibold text-sm text-slate-700 dark:text-white">
                                            {room.title || room.roomId}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">ID: {room.roomId}</p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/dashboard/room')}
                                        className="bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-all duration-200 active:scale-95"
                                    >
                                        Lihat
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Aktifitas Terbaru */}
                <div className="bg-white dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/10 transition-colors duration-300">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-800 dark:text-white text-base">Aktifitas Terbaru</h2>
                    </div>

                    {loadingLogs ? (
                        <div className="flex flex-col gap-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                            ))}
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            Belum ada aktifitas
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {logs.map(log => (
                                <div key={log.id} className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full ${getSeverityColor(log.flag?.severity ?? 1)} flex items-center justify-center text-white flex-shrink-0`}>
                                        {getSeverityIcon(log.flag?.severity ?? 1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm text-slate-700 dark:text-white truncate">
                                            {log.flag?.label || log.flagKey}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            Room {log.session?.roomId || '-'} · {log.session?.token || '-'}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 flex-shrink-0">
                                        {formatTime(log.timestamp)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}