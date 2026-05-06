"use client"
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import session from "../../../../../../lib/session";
import { ChartLineIcon, Download, Square } from "lucide-react";
import { useWebRtc } from "../../../../../../context/WebRtcProvider";
import { useModal } from "../../../../../../context/ModalProvider";
import AlertModal from "../../../../../../components/ui/AlertModal";
import TitleModal from "../../../../../../components/ui/modal/TitleModal";
import BodyModal from "../../../../../../components/ui/modal/BodyModal";
import * as XLSX from "xlsx";

export enum SessionStatus {
    Scheduled,
    Ongoing,
    Completed,
    Paused,
}

export type SessionProps = {
    id: string;
    roomId: string;
    proctoredUserId: string;
    token: string
    proctored_user: {
        name: string
        identifier?: string
    }
    startTime?: string;
    endTime?: string;
    status?: SessionStatus;
    isOnline: boolean;
    session_result: SessionResultProps
};

export enum FraudLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export type SessionResultProps = {
    id: string
    sessionId: string
    fraudLevel: FraudLevel
    totalFlags: number
    totalSeverity: number
    falseDetection: number
    trueSeverity: number
    updatedAt?: string
    createdAt?: string
}

const fraudLevelBadge = {
    [FraudLevel.CRITICAL]: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30",
    [FraudLevel.HIGH]:     "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30",
    [FraudLevel.MEDIUM]:   "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
    [FraudLevel.LOW]:      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30",
}

const statusBadge = (status: any) => {
    const s = String(status).toLowerCase()
    switch (s) {
        case "ongoing": case "1": case "active": return "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30"
        case "completed": case "2":              return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
        case "paused": case "3":                 return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
        case "scheduled": case "0":              return "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
        default:                                 return "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
    }
}

const statusLabel = (status: any) => {
    const s = String(status).toLowerCase()
    switch (s) {
        case "ongoing": case "1": case "active": return "Ongoing"
        case "completed": case "2":              return "Completed"
        case "paused": case "3":                 return "Paused"
        case "scheduled": case "0":              return "Scheduled"
        default:                                 return String(status)
    }
}

const UserSessionTable = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { roomId } = useParams()
    const [sessions, setSessions] = useState<SessionProps[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [threshold, setThreshold] = useState(100)
    const [search, setSearch] = useState("")
    const { openModal, closeModal } = useModal()
    const { peers, socketRef } = useWebRtc()

    useEffect(() => {
        if (!roomId) return;
        fetchSessions(1)
        fetchGlobalSetting()
    }, [roomId]);

    useEffect(() => {
        if (peers.length < 0) return
        fetchSessions(1)
        fetchGlobalSetting()
    }, [peers])

    const fetchSessions = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/sessions-in-room/${roomId}?page=${nextPage}&paginationLimit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setSessions(prev => {
                    const updatedSessions = prev.map(s => ({
                        ...s,
                        isOnline: peers.some(peer => peer.token === s.token),
                    }));
                    const newSessions = data.data
                        .filter((d: SessionProps) => !prev.some(p => p.token === d.token))
                        .map((d: SessionProps) => ({
                            ...d,
                            isOnline: peers.some(peer => peer.token === d.token),
                        }));
                    return [...updatedSessions, ...newSessions]
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        }
    };

    const fetchGlobalSetting = async () => {
        try {
            const token = await session();
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/global-settings?page=1&paginationLimit=1`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const { data } = await response.json()
                setThreshold(parseInt(data[0].value))
            }
        } catch (error) { }
    }

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchSessions(page + 1);
        }
    };

    const calcFraudLevel = (totalSeverity: number) => {
        const p = (totalSeverity / threshold) * 100;
        return p >= 90 ? FraudLevel.CRITICAL : p >= 65 ? FraudLevel.HIGH : p >= 25 ? FraudLevel.MEDIUM : FraudLevel.LOW;
    }

    const handleExport = () => {
        const exportData = sessions.map(s => ({
            "Connection":      s.isOnline ? "Connected" : "Disconnected",
            "Session Token":   s.token,
            "Nama":            s.proctored_user?.name || "-",
            "NRP":             s.proctored_user?.identifier || "-",
            "Start Time":      s.startTime || "-",
            "End Time":        s.endTime || "-",
            "Session Status":  statusLabel(s.status),
            "Fraud Status":    s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW,
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Participants")
        XLSX.writeFile(wb, `participants-${roomId}.xlsx`)
    }

    const handleAbortSession = async (token: string, state: string) => {
        socketRef.current.emit("DASHBOARD_SERVER_MESSAGE", {
            data: {
                action: "ABORT_PROCTORING",
                token,
                roomId,
                state,
                error: ":Proctor " + state + " the session"
            }
        }, (data: any) => {
            if (data.success) {
                setSessions([])
                fetchSessions(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">State Updated</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Cant abort or complete session that not started yet</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        })
    }

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-screen">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Participants</h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input
                            type="text"
                            placeholder="Search Users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                        />
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/25 active:scale-95"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Table card */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="max-h-[75vh] overflow-y-auto" onScroll={handleScroll} ref={scrollRef}>
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-white dark:bg-[#0f0f13] border-b border-slate-100 dark:border-white/10 z-10">
                                <tr>
                                    {["Connection", "Session Token", "Nama", "NRP", "Start Time", "End Time", "Session Status", "Fraud Status", "Analytics", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-12 text-slate-400 text-sm">Tidak ada peserta</td>
                                    </tr>
                                ) : (
                                    sessions.filter(s =>
                                        s.token.toLowerCase().includes(search.toLowerCase()) ||
                                        (s.proctored_user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
                                        (s.proctored_user?.identifier || "").toLowerCase().includes(search.toLowerCase())
                                    ).map((s) => {
                                        const fraudLevel = s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW
                                        return (
                                            <tr key={s.token} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                {/* Connection */}
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.isOnline ? 'bg-green-500' : 'bg-red-400'}`} />
                                                        <span className={`text-xs font-medium ${s.isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                            {s.isOnline ? 'Connected' : 'Disconnected'}
                                                        </span>
                                                    </div>
                                                </td>
                                                {/* Session Token */}
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-white font-mono whitespace-nowrap">
                                                    {s.token}
                                                </td>
                                                {/* Nama - tanpa avatar */}
                                                <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-white whitespace-nowrap">
                                                    {s.proctored_user?.name || "-"}
                                                </td>
                                                {/* NRP */}
                                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {s.proctored_user?.identifier || "-"}
                                                </td>
                                                {/* Start Time */}
                                                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {s.startTime || "-"}
                                                </td>
                                                {/* End Time */}
                                                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {s.endTime || "-"}
                                                </td>
                                                {/* Session Status */}
                                                <td className="px-6 py-4">
                                                    <span className={`${statusBadge(s.status)} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>
                                                        {statusLabel(s.status)}
                                                    </span>
                                                </td>
                                                {/* Fraud Status */}
                                                <td className="px-6 py-4">
                                                    <span className={`${fraudLevelBadge[fraudLevel]} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>
                                                        {fraudLevel}
                                                    </span>
                                                </td>
                                                {/* Analytics - icon biru, gaya action */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => router.push(pathname + "/analytics/" + s.token)}
                                                        className="p-2 rounded-lg border border-blue-200 dark:border-blue-500/30 hover:bg-blue-500 hover:border-blue-500 text-blue-500 hover:text-white transition-all duration-200"
                                                    >
                                                        <ChartLineIcon size={14} />
                                                    </button>
                                                </td>
                                                {/* Action - End */}
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleAbortSession(s.token, "completed")}
                                                        className="p-2 rounded-lg border border-red-200 dark:border-red-500/30 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white transition-all duration-200"
                                                    >
                                                        <Square size={14} fill="currentColor" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {sessions.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-50 dark:border-white/5 text-xs text-slate-400">
                        Showing {sessions.length} participant{sessions.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSessionTable;