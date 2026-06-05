"use client";
import { memo, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import session from "../../../../../../lib/session";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { formattedTimestamp } from "../../../../../utils/timestamp";
import { useWebRtc } from "../../../../../../context/WebRtcProvider";
import ConfirmLogButton from "./ui/ConfirmLogButton";

export enum logType {
    System = "System",
    True = "True",
    False = "False"
}

export type LogProps = {
    id: string;
    _id: string;
    sessionId: string;
    attachment?: any;
    logType: logType;
    timestamp: string;
    flagKey?: string | null;
    flag: {
        id: string;
        flagKey: string;
        label: string;
        severity: number;
    }
    session: {
        proctoredUserId: string
        token: string
    }
};

const severityBg = (s: number) =>
    s >= 3 ? "bg-red-500" : s === 2 ? "bg-orange-400" : "bg-amber-400"

const LogsTable = () => {
    const { roomId } = useParams();
    const [logs, setLogs] = useState<LogProps[]>([]);
    const [sessionMap, setSessionMap] = useState<Record<string, { name: string; identifier: string }>>({})
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("")
    const [filterKey, setFilterKey] = useState<string | null>(null)
    const [showFilter, setShowFilter] = useState(false)
    const [selectedLog, setSelectedLog] = useState<LogProps | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null);
    const { peers, notificationCount } = useWebRtc()

    // Fetch sessions for name/NRP mapping
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const token = await session()
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-users?page=1&paginationLimit=100`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (res.ok) {
                    const data = await res.json()
                    const map: Record<string, { name: string; identifier: string }> = {}
                    data.data.forEach((u: any) => {
                        map[u.id] = {
                            name: u.name || "Peserta",
                            identifier: u.identifier || "-",
                        }
                    })
                    setSessionMap(map)
                }
            } catch (err) { console.error("Failed to fetch users", err) }
        }
        fetchSessions()
    }, [])

    useEffect(() => {
        if (!roomId) return;
        setLogs([]); setPage(1); setHasMore(true);
        fetchLogs(1);
    }, [peers, roomId])

    useEffect(() => {
        if (!roomId || notificationCount.length === 0) return;
        insertNewLogsFromSocket(1)
    }, [notificationCount]);

    const fetchLogs = async (nextPage: number) => {
        setLoading(true);
        try {
            const token = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || "https://202.10.34.67:5050"}/api/logs-in-room/${roomId}?page=${nextPage}&paginationLimit=20`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) {
                const el = scrollRef.current;
                const prevScrollHeight = el?.scrollHeight || 0;
                setLogs(prev => {
                    const unique = data.data.filter((d: LogProps) => !prev.some(p => p._id === d._id));
                    return unique.length === 0 ? prev : [...prev, ...unique];
                });
                setHasMore(nextPage < data.totalPages);
                setPage(nextPage);
                requestAnimationFrame(() => {
                    if (el && nextPage > 1) {
                        el.scrollTop = el.scrollHeight - prevScrollHeight;
                    } else if (el) {
                        el.scrollTop = el.scrollHeight;
                    }
                });
            }
        } catch (err) { console.error("Failed to fetch logs", err); }
        finally { setLoading(false); }
    };

    const insertNewLogsFromSocket = async (count: number) => {
        try {
            const token = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || "https://202.10.34.67:5050"}/api/logs-in-room/${roomId}?page=1&paginationLimit=${count}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (res.ok) {
                setLogs(prev => {
                    const unique = data.data.filter((d: LogProps) => !prev.some(p => p._id === d._id));
                    if (unique.length === 0) return prev;
                    const newLogs = [...unique, ...prev];
                    if (!selectedLog) setSelectedLog(unique[0]);
                    return newLogs;
                });
                requestAnimationFrame(() => {
                    const el = scrollRef.current;
                    if (el) el.scrollTop = el.scrollHeight;
                });
            }
        } catch (err) { console.error("Failed to fetch logs", err); }
    }

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop <= 50) fetchLogs(page + 1);
    };

    // Unique flagKeys for filter
    const flagKeys = Array.from(new Set(logs.map(l => l.flagKey).filter(Boolean))) as string[]

    // Filter + search
    const filteredLogs = [...logs].reverse().filter(log => {
        const userInfo = sessionMap[log.session.token] || sessionMap[log.session.proctoredUserId]
        const s = search.toLowerCase()
        const matchSearch = !s ||
            (userInfo?.name || "").toLowerCase().includes(s) ||
            (userInfo?.identifier || "").toLowerCase().includes(s) ||
            (log.flagKey || "").toLowerCase().includes(s)
        const matchFilter = !filterKey || log.flagKey === filterKey
        return matchSearch && matchFilter
    })

    const selectedIndex = filteredLogs.findIndex(l => l._id === selectedLog?._id)
    const handlePrev = () => { if (selectedIndex > 0) setSelectedLog(filteredLogs[selectedIndex - 1]) }
    const handleNext = () => { if (selectedIndex < filteredLogs.length - 1) setSelectedLog(filteredLogs[selectedIndex + 1]) }

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent flex flex-col gap-6" style={{ height: '100vh', overflow: 'hidden' }}>

            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Aktifitas Ruangan</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search nama, NRP, flag..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                        />
                    </div>
                </div>
            </div>

            {/* 2 panel */}
            <div className="flex gap-4 flex-1 min-h-0">

                {/* ── KIRI: Event list 60% ── */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col min-h-0 overflow-hidden" style={{ width: '60%' }}>
                    {/* Panel header */}
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between flex-shrink-0">
                        <h2 className="font-semibold text-slate-800 dark:text-white">Event</h2>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(v => !v)}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                            >
                                <Filter size={12} /> Filter
                            </button>
                            {showFilter && (
                                <div
                                    className="absolute top-10 right-0 z-20 bg-white dark:bg-[#0f0f13] border border-slate-100 dark:border-white/10 rounded-xl shadow-xl p-4 min-w-[220px]"
                                    style={{ animation: 'filterIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}
                                >
                                    <style>{`
                                        @keyframes filterIn {
                                            from { opacity: 0; transform: scale(0.95) translateY(-8px); }
                                            to   { opacity: 1; transform: scale(1) translateY(0); }
                                        }
                                    `}</style>
                                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">Filter</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => { setFilterKey(null); setShowFilter(false) }}
                                            className={`text-xs px-3 py-1 rounded-lg font-medium border transition-all ${filterKey === null ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
                                        >
                                            ALL {logs.length}
                                        </button>
                                        {flagKeys.map(key => (
                                            <button
                                                key={key}
                                                onClick={() => { setFilterKey(key); setShowFilter(false) }}
                                                className={`text-xs px-3 py-1 rounded-lg font-medium border transition-all ${filterKey === key ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
                                            >
                                                {key}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Scrollable list */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto
                            [&::-webkit-scrollbar]:w-1.5
                            [&::-webkit-scrollbar-track]:rounded-full
                            [&::-webkit-scrollbar-track]:bg-slate-100
                            [&::-webkit-scrollbar-thumb]:rounded-full
                            [&::-webkit-scrollbar-thumb]:bg-slate-300
                            dark:[&::-webkit-scrollbar-track]:bg-white/5
                            dark:[&::-webkit-scrollbar-thumb]:bg-white/20
                        "
                    >
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">Belum ada aktifitas</div>
                        ) : filteredLogs.map(log => {
                            const userInfo = sessionMap[log.session.token] || sessionMap[log.session.proctoredUserId]
                            return (
                                <button
                                    key={log._id}
                                    onClick={() => setSelectedLog(log)}
                                    className={`w-full px-5 py-3.5 flex items-start gap-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left ${selectedLog?._id === log._id ? 'bg-indigo-50 dark:bg-[#4F46E5]/10 border-l-2 border-l-[#4F46E5]' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${severityBg(log.flag?.severity ?? 0)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                                        {log.flag?.severity ?? 0}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                            <span className="text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-2 py-0.5 rounded-lg">
                                                {log.flagKey}
                                            </span>
                                            {userInfo && (
                                                <span className="text-xs font-semibold text-slate-700 dark:text-white uppercase tracking-wide">
                                                    {userInfo.name}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                            {log.flag?.label || log.flagKey}
                                        </p>
                                    </div>
                                </button>
                            )
                        })}
                        {loading && <div className="text-center py-4 text-slate-400 text-xs">Memuat...</div>}
                    </div>
                </div>

                {/* ── KANAN: Detail 40% ── */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col min-h-0 overflow-hidden" style={{ width: '40%' }}>
                    {selectedLog ? (
                        <>
                            {/* Nav header */}
                            <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between flex-shrink-0">
                                <h3 className="font-semibold text-slate-800 dark:text-white truncate max-w-[70%]">
                                    {selectedLog.flag?.label || selectedLog.flagKey}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <button onClick={handlePrev} disabled={selectedIndex <= 0}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all">
                                        <ChevronLeft size={14} />
                                    </button>
                                    <button onClick={handleNext} disabled={selectedIndex >= filteredLogs.length - 1}
                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 disabled:opacity-30 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Screenshot */}
                            <div className="bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0" style={{ height: '45%' }}>
                                {selectedLog.attachment?.file ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT || process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}${selectedLog.attachment.file}`}
                                        alt="screenshot"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-sm text-slate-400">Tidak ada screenshot</span>
                                )}
                            </div>

                            {/* Detail */}
                            <div className="p-6 flex flex-col gap-4 overflow-y-auto flex-1">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Flag</p>
                                        <span className="text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-3 py-1 rounded-lg">
                                            {selectedLog.flagKey}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Severity</p>
                                        <span className={`text-sm font-bold text-white px-3 py-1 rounded-lg ${severityBg(selectedLog.flag?.severity ?? 0)}`}>
                                            {selectedLog.flag?.severity ?? 0}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Detect As</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-white">{selectedLog.logType || "-"}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Time</p>
                                        <p className="text-sm font-medium text-slate-700 dark:text-white">{formattedTimestamp(selectedLog.timestamp)}</p>
                                    </div>
                                </div>

                                {(() => {
                                    const userInfo = sessionMap[selectedLog.session.token] || sessionMap[selectedLog.session.proctoredUserId]
                                    return (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Nama</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-white">{userInfo?.name || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">NRP</p>
                                                <p className="text-sm font-medium text-slate-700 dark:text-white">{userInfo?.identifier || "-"}</p>
                                            </div>
                                        </div>
                                    )
                                })()}

                                {(selectedLog.attachment?.url || selectedLog.attachment?.desc) && (
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Detail</p>
                                        <p className="text-sm text-blue-500 italic break-all">
                                            {selectedLog.attachment?.url || selectedLog.attachment?.desc}
                                        </p>
                                    </div>
                                )}

                                {!["CONNECT", "DISCONNECT"].includes(selectedLog.flagKey || "") && (
                                    <div className="mt-auto pt-2">
                                        <ConfirmLogButton
                                            id={selectedLog._id}
                                            currentLogType={selectedLog.logType}
                                            callback={() => fetchLogs(1)}
                                        />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                            Pilih event untuk melihat detail
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogsTable;

export { LogsTable };
export type { LogProps as BodyTable };