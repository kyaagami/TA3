'use client'

import { useEffect, useRef, useState } from "react"
import { Bell, AlertTriangle, Activity, Wifi } from "lucide-react"

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
    if (severity >= 3) return <AlertTriangle size={12} />
    if (severity === 2) return <Activity size={12} />
    return <Wifi size={12} />
}

const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const NotificationBell = () => {
    const [open, setOpen] = useState(false)
    const [logs, setLogs] = useState<Log[]>([])
    const [hasNew, setHasNew] = useState(false)
    const [lastSeenId, setLastSeenId] = useState<string | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/session')
            const { token } = await res.json()
            const res2 = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/logs-recent?limit=8`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            if (res2.ok) {
                const data = await res2.json()
                setLogs(data)
                // Cek apakah ada log baru sejak terakhir dilihat
                if (data.length > 0 && data[0].id !== lastSeenId && lastSeenId !== null) {
                    setHasNew(true)
                }
                if (lastSeenId === null && data.length > 0) {
                    setLastSeenId(data[0].id)
                }
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err)
        }
    }

    useEffect(() => {
        fetchLogs()
        const interval = setInterval(fetchLogs, 5000)
        return () => clearInterval(interval)
    }, [lastSeenId])

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleOpen = () => {
        setOpen(prev => !prev)
        if (!open) {
            setHasNew(false)
            if (logs.length > 0) setLastSeenId(logs[0].id)
        }
    }

    return (
        <div ref={ref} className="relative">
            {/* Bell button */}
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-white transition-all duration-200 focus:outline-none"
            >
                <Bell size={20} />
                {hasNew && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0f0f13] animate-pulse" />
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div
                    style={{ animation: 'dropdownIn 0.2s ease' }}
                    className="absolute right-0 top-[calc(100%+12px)] z-50 w-80 rounded-2xl shadow-2xl bg-white dark:bg-[#0f0f13] border border-gray-100 dark:border-white/10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <p className="font-semibold text-sm text-slate-700 dark:text-white">Notification</p>
                        {/* {logs.length > 0 && (
                            <span className="text-[10px] text-slate-400">
                                {logs.length} aktivitas terbaru
                            </span>
                        )} */}
                    </div>

                    {/* Log list */}
                    <div className="py-2 max-h-80 overflow-y-auto">
                        {logs.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs">
                                Tidak ada notifikasi
                            </div>
                        ) : (
                            logs.map(log => (
                                <div
                                    key={log.id}
                                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className={`w-9 h-9 rounded-full ${getSeverityColor(log.flag?.severity ?? 1)} flex items-center justify-center text-white flex-shrink-0`}>
                                        {getSeverityIcon(log.flag?.severity ?? 1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 dark:text-white truncate">
                                            {log.flag?.label || log.flagKey}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">
                                            Room {log.session?.roomId || '-'} · {log.session?.token || '-'}
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 flex-shrink-0">
                                        {formatTime(log.timestamp)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell