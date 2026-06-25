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

export enum SessionStatus { Scheduled, Ongoing, Completed, Paused }

export type SessionProps = {
    id: string; roomId: string; proctoredUserId: string; token: string
    proctored_user: { name: string; identifier?: string }
    startTime?: string; endTime?: string; status?: SessionStatus;
    isOnline: boolean; session_result: SessionResultProps
};

export enum FraudLevel { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH', CRITICAL = 'CRITICAL' }

export type SessionResultProps = {
    id: string; sessionId: string; fraudLevel: FraudLevel
    totalFlags: number; totalSeverity: number; falseDetection: number; trueSeverity: number
    updatedAt?: string; createdAt?: string
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

type SortOption = "default" | "nama-az" | "nama-za" | "nrp-asc" | "nrp-desc"
type FilterConnection = "all" | "connected" | "disconnected"
type FilterStatus = "all" | "ongoing" | "completed" | "paused" | "scheduled"
type FilterFraud = "all" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"

const sortLabels: Record<SortOption, string> = {
    "default":  "Default",
    "nama-az":  "Nama A→Z",
    "nama-za":  "Nama Z→A",
    "nrp-asc":  "NRP Terkecil",
    "nrp-desc": "NRP Terbesar",
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
    const { openModal, closeModal } = useModal()
    const { peers, socketRef } = useWebRtc()

    // Filter & Sort states
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("default")
    const [filterConn, setFilterConn] = useState<FilterConnection>("all")
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
    const [filterFraud, setFilterFraud] = useState<FilterFraud>("all")
    const [showFilter, setShowFilter] = useState(false)

    useEffect(() => {
        if (!roomId) return;
        fetchSessions(1); fetchGlobalSetting();
    }, [roomId]);

    useEffect(() => {
        if (peers.length < 0) return;
        fetchSessions(1); fetchGlobalSetting();
    }, [peers])

    const fetchSessions = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/sessions-in-room/${roomId}?page=${nextPage}&paginationLimit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setSessions(prev => {
                    const updatedSessions = prev.map(s => ({ ...s, isOnline: peers.some(peer => peer.token === s.token) }));
                    const newSessions = data.data
                        .filter((d: SessionProps) => !prev.some(p => p.token === d.token))
                        .map((d: SessionProps) => ({ ...d, isOnline: peers.some(peer => peer.token === d.token) }));
                    return [...updatedSessions, ...newSessions]
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false); setPage(nextPage);
            }
        } catch (err) { console.error("Failed to fetch sessions", err); }
    };

    const fetchGlobalSetting = async () => {
        try {
            const token = await session();
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/global-settings?page=1&paginationLimit=1`, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) { const { data } = await response.json(); setThreshold(parseInt(data[0].value)) }
        } catch (error) { }
    }

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) fetchSessions(page + 1);
    };

    const calcFraudLevel = (totalSeverity: number) => {
        const p = (totalSeverity / threshold) * 100;
        return p >= 90 ? FraudLevel.CRITICAL : p >= 65 ? FraudLevel.HIGH : p >= 25 ? FraudLevel.MEDIUM : FraudLevel.LOW;
    }

    const handleExport = () => {
        const exportData = filtered.map(s => ({
            "Connection":     s.isOnline ? "Connected" : "Disconnected",
            "Session Token":  s.token,
            "Nama":           s.proctored_user?.name || "-",
            "NRP":            s.proctored_user?.identifier || "-",
            "Start Time":     s.startTime || "-",
            "End Time":       s.endTime || "-",
            "Session Status": statusLabel(s.status),
            "Fraud Status":   s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW,
        }))
        const ws = XLSX.utils.json_to_sheet(exportData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Participants")
        XLSX.writeFile(wb, `participants-${roomId}.xlsx`)
    }

    const handleAbortSession = async (token: string, state: string) => {
        socketRef.current.emit("DASHBOARD_SERVER_MESSAGE", {
            data: { action: "ABORT_PROCTORING", token, roomId, state, error: ":Proctor " + state + " the session" }
        }, (data: any) => {
            if (data.success) {
                setSessions([]); fetchSessions(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">State Updated</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Cant abort or complete session that not started yet</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        })
    }

    // Filter + Sort
    const filtered = sessions
        .filter(s => {
            const q = search.toLowerCase()
            const matchSearch = !q ||
                s.token.toLowerCase().includes(q) ||
                (s.proctored_user?.name || "").toLowerCase().includes(q) ||
                (s.proctored_user?.identifier || "").toLowerCase().includes(q)
            const matchConn = filterConn === "all" || (filterConn === "connected" ? s.isOnline : !s.isOnline)
            const matchStatus = filterStatus === "all" || statusLabel(s.status).toLowerCase() === filterStatus
            const fraudLevel = s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW
            const matchFraud = filterFraud === "all" || fraudLevel === filterFraud
            return matchSearch && matchConn && matchStatus && matchFraud
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "nama-az": return (a.proctored_user?.name || "").localeCompare(b.proctored_user?.name || "")
                case "nama-za": return (b.proctored_user?.name || "").localeCompare(a.proctored_user?.name || "")
                case "nrp-asc": return (a.proctored_user?.identifier || "").localeCompare(b.proctored_user?.identifier || "", undefined, { numeric: true })
                case "nrp-desc": return (b.proctored_user?.identifier || "").localeCompare(a.proctored_user?.identifier || "", undefined, { numeric: true })
                default: return 0
            }
        })

    const activeFilters = [filterConn !== "all", filterStatus !== "all", filterFraud !== "all"].filter(Boolean).length

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-screen">
            <style>{`@keyframes filterIn { from { opacity:0; transform:scale(0.95) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Participants</h1>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        <input type="text" placeholder="Search nama, NRP..." value={search} onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full" />
                    </div>

                    {/* Filter & Sort — 1 tombol */}
                    <div className="relative">
                        <button onClick={() => setShowFilter(v => !v)}
                            className={`flex items-center gap-2 border text-sm font-medium px-4 py-2.5 rounded-xl transition-all ${activeFilters > 0 || sortBy !== 'default' ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#4F46E5] hover:text-[#4F46E5]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                            Filter & Sort
                            {(activeFilters > 0 || sortBy !== 'default') && (
                                <span className="bg-white/30 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {activeFilters + (sortBy !== 'default' ? 1 : 0)}
                                </span>
                            )}
                        </button>

                        {showFilter && (
                            <div className="absolute top-12 right-0 z-20 bg-white dark:bg-[#0f0f13] border border-slate-100 dark:border-white/10 rounded-xl shadow-xl p-4 w-64"
                                style={{ animation: 'filterIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}>

                                {/* Sort */}
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Urutkan</p>
                                <div className="flex flex-col gap-1 mb-4">
                                    {(Object.keys(sortLabels) as SortOption[]).map(k => (
                                        <button key={k} onClick={() => setSortBy(k)}
                                            className={`w-full text-left px-3 py-1.5 text-sm rounded-lg transition-all ${sortBy === k ? 'bg-[#4F46E5] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                            {sortLabels[k]}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Koneksi */}
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Koneksi</p>
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {[["all","Semua"],["connected","Connected"],["disconnected","Disconnected"]].map(([v,l]) => (
                                        <button key={v} onClick={() => setFilterConn(v as FilterConnection)}
                                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${filterConn === v ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Status */}
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Session Status</p>
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {[["all","Semua"],["completed","Completed"],["paused","Paused"],["scheduled","Scheduled"]].map(([v,l]) => (
                                        <button key={v} onClick={() => setFilterStatus(v as FilterStatus)}
                                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${filterStatus === v ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>

                                {/* Filter Fraud */}
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Fraud Level</p>
                                <div className="flex gap-2 flex-wrap mb-4">
                                    {[["all","Semua"],["CRITICAL","Critical"],["HIGH","High"],["MEDIUM","Medium"],["LOW","Low"]].map(([v,l]) => (
                                        <button key={v} onClick={() => setFilterFraud(v as FilterFraud)}
                                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${filterFraud === v ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}>
                                            {l}
                                        </button>
                                    ))}
                                </div>

                                {/* Reset + Apply */}
                                <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
                                    <button onClick={() => { setFilterConn("all"); setFilterStatus("all"); setFilterFraud("all"); setSortBy("default") }}
                                        className="flex-1 text-xs text-slate-500 hover:text-red-500 font-medium py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                                        Reset
                                    </button>
                                    <button onClick={() => setShowFilter(false)}
                                        className="flex-1 text-xs bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-1.5 rounded-lg transition-all">
                                        Terapkan
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Export */}
                    <button onClick={handleExport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all active:scale-95">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="max-h-[75vh] overflow-y-auto" onScroll={handleScroll} ref={scrollRef}>
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-white dark:bg-[#0f0f13] border-b border-slate-100 dark:border-white/10 z-10">
                                <tr>
                                    {["Connection", "Session Token", "Nama", "NRP", "Start Time", "End Time", "Session Status", "Fraud Status", "Kelola"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan={9} className="text-center py-12 text-slate-400 text-sm">Tidak ada peserta</td></tr>
                                ) : filtered.map((s) => {
                                    const fraudLevel = s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW
                                    return (
                                        <tr key={s.token} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.isOnline ? 'bg-green-500' : 'bg-red-400'}`} />
                                                    <span className={`text-xs font-medium ${s.isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                                                        {s.isOnline ? 'Connected' : 'Disconnected'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-white font-mono whitespace-nowrap">{s.token}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-white whitespace-nowrap">{s.proctored_user?.name || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.proctored_user?.identifier || "-"}</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.startTime || "-"}</td>
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.endTime || "-"}</td>
                                            <td className="px-6 py-4">
                                                <span className={`${statusBadge(s.status)} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>{statusLabel(s.status)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`${fraudLevelBadge[fraudLevel]} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>{fraudLevel}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => router.push(pathname + "/analytics/" + s.token)} title="Lihat Analytics"
                                                        className="p-2 rounded-lg border border-blue-200 dark:border-blue-500/30 hover:bg-blue-500 hover:border-blue-500 text-blue-500 hover:text-white transition-all">
                                                        <ChartLineIcon size={14} />
                                                    </button>
                                                    <button onClick={() => handleAbortSession(s.token, "completed")} title="Akhiri Sesi"
                                                        className="p-2 rounded-lg border border-red-200 dark:border-red-500/30 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white transition-all">
                                                        <Square size={14} fill="currentColor" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                {sessions.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-50 dark:border-white/5 text-xs text-slate-400">
                        Showing {filtered.length} of {sessions.length} participant{sessions.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSessionTable;
