"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import session from "../../../../../../lib/session";
import { LogProps } from "../../../../room/[roomId]/logs/components/LogsTable";
import ConfirmLogButton from "../../../../room/[roomId]/logs/components/ui/ConfirmLogButton";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { formattedTimestamp } from "../../../../../utils/timestamp";
import { FraudLevel, SessionResultProps } from "../../../../room/[roomId]/users/components/UserSessionTable";

const fraudLevelBadge: Record<string, string> = {
    CRITICAL: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30",
    HIGH:     "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/30",
    MEDIUM:   "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
    LOW:      "bg-green-50 text-green-600 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
}

const severityBg = (s: number) =>
    s >= 3 ? "bg-red-500" : s === 2 ? "bg-orange-400" : "bg-amber-400"

export default function AnalyticsPage() {
    const { token, userId } = useParams()
    const router = useRouter()

    const [dataPoints, setDataPoints] = useState<Array<LogProps>>([])
    const [dataCounter, setDataCounter] = useState<Array<{ flagKey: string; count: number }>>([])
    const [sessionResult, setSessionResult] = useState<SessionResultProps>(null)
    const [threshold, setThreshold] = useState(1)
    const [updateLog, setUpdateLog] = useState(0)
    const [userName, setUserName] = useState<string>("")
    const [selectedLog, setSelectedLog] = useState<LogProps | null>(null)
    const [filterKey, setFilterKey] = useState<string | null>(null)
    const [showFilter, setShowFilter] = useState(false)

    const fetchlogs = async (nextPage: number, limit: number) => {
        try {
            const jwt = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || "https://192.168.43.85:5050"}/api/logs-proctored-user/${token}?page=${nextPage}&paginationLimit=${limit}`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            const data = await res.json();
            if (res.ok) return data;
        } catch (err) { console.error("Failed to fetch logs", err); }
        return null;
    };

    const fetchSessionResult = async () => {
        try {
            const jwt = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || "https://192.168.43.85:5050"}/api/session-result-token/${token}`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            if (res.ok) {
                const data = await res.json()
                if (data.name) { router.back(); return; }
                setSessionResult(data)
            }
        } catch (error) { }
    }

    const fetchGlobalSetting = async () => {
        try {
            const t = await session();
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/global-settings?page=1&paginationLimit=1`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (response.ok) {
                const { data } = await response.json()
                setThreshold(parseInt(data[0].value))
            }
        } catch (error) { }
    }

    const fetchUserName = async () => {
        try {
            const t = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-users?page=1&paginationLimit=100`,
                { headers: { Authorization: `Bearer ${t}` } }
            )
            if (res.ok) {
                const data = await res.json()
                const user = data.data.find((u: any) => u.id === userId)
                if (user) setUserName(user.name)
            }
        } catch (err) { }
    }

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const { total } = await fetchlogs(1, 1);
                if (!total) return;
                const { data } = await fetchlogs(1, total);
                const reversed = data.reverse();
                setDataPoints(reversed);
                setSelectedLog(reversed[0] ?? null);
                setDataCounter(
                    Object.entries(
                        data.reduce((acc: any, item: LogProps) => {
                            acc[item.flagKey] = (acc[item.flagKey] || 0) + 1;
                            return acc;
                        }, {})
                    ).map(([flagKey, count]) => ({ flagKey, count: count as number }))
                )
            } catch (e) { console.error("Error loading data", e); }
        };
        fetchSessionResult()
        fetchGlobalSetting()
        fetchUserName()
        loadAllData();
    }, [updateLog]);

    const filteredLogs = filterKey ? dataPoints.filter(d => d.flagKey === filterKey) : dataPoints
    const reviewedCount = dataPoints.filter(d => d.logType !== "System").length
    const selectedIndex = filteredLogs.findIndex(d => d.id === selectedLog?.id)
    const handlePrev = () => { if (selectedIndex > 0) setSelectedLog(filteredLogs[selectedIndex - 1]) }
    const handleNext = () => { if (selectedIndex < filteredLogs.length - 1) setSelectedLog(filteredLogs[selectedIndex + 1]) }

    const duration = useMemo(() => {
        if (dataPoints.length < 2) return null;
        const first = new Date(dataPoints[0].timestamp)
        const last = new Date(dataPoints[dataPoints.length - 1].timestamp)
        const diffMs = last.getTime() - first.getTime()
        return {
            minutes: Math.floor(diffMs / 60000),
            started: first.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            ended: last.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        }
    }, [dataPoints])

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-screen flex flex-col gap-6">

            {/* Header — sama seperti halaman lain */}
            <h1 className="font-bold text-2xl text-slate-800 dark:text-white">
                {userName || "..."} / Analytics
            </h1>

            {/* 3-panel: kiri | tengah | kanan */}
            <div className="flex gap-4 overflow-hidden" style={{ height: 'calc(100vh - 170px)' }}>

                {/* ── KIRI: Summary + Review Progress ── */}
                <div className="flex flex-col gap-4 w-[20%] flex-shrink-0 overflow-hidden">
                    {/* Summary */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4">
                        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Summary</h2>
                        {sessionResult ? (
                            <>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1.5">Fraud Level</p>
                                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${fraudLevelBadge[sessionResult.fraudLevel] || fraudLevelBadge.LOW}`}>
                                        {sessionResult.fraudLevel}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-1">
                                    <div>
                                        <p className="text-xs text-slate-400">Flags</p>
                                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{sessionResult.totalFlags}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">Severity</p>
                                        <p className="text-3xl font-bold text-red-500">{sessionResult.totalSeverity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">True</p>
                                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{sessionResult.trueSeverity}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400">False</p>
                                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{sessionResult.falseDetection}</p>
                                    </div>
                                </div>
                                <div className="pt-1">
                                    <p className="text-xs text-slate-400 mb-2">Flag breakdown</p>
                                    <div className="flex flex-col gap-2">
                                        {dataCounter.map(({ flagKey, count }) => (
                                            <div key={flagKey} className="flex items-center justify-between">
                                                <span className="text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-2 py-0.5 rounded-lg font-medium">
                                                    {flagKey}
                                                </span>
                                                <span className="text-sm font-semibold text-slate-700 dark:text-white">{count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-xs text-slate-400">Memuat...</div>
                        )}
                    </div>

                    {/* Review Progress */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4">
                        <h2 className="font-semibold text-lg text-slate-800 dark:text-white">Review progress</h2>
                        <div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">{reviewedCount}</span>
                                <span className="ml-1">of {dataPoints.length} reviewed</span>
                            </p>
                            <div className="mt-3 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#4F46E5] rounded-full transition-all"
                                    style={{ width: dataPoints.length > 0 ? `${(reviewedCount / dataPoints.length) * 100}%` : '0%' }}
                                />
                            </div>
                        </div>
                        {duration && (
                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="font-medium text-slate-700 dark:text-white">{duration.minutes} minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Started</span>
                                    <span className="font-medium text-slate-700 dark:text-white">{duration.started}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Ended</span>
                                    <span className="font-medium text-slate-700 dark:text-white">{duration.ended}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── TENGAH: Event list ── */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col w-[35%] flex-shrink-0 overflow-hidden">
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
                                            ALL {dataPoints.length}
                                        </button>
                                        {dataCounter.map(({ flagKey, count }) => (
                                            <button
                                                key={flagKey}
                                                onClick={() => { setFilterKey(flagKey); setShowFilter(false) }}
                                                className={`text-xs px-3 py-1 rounded-lg font-medium border transition-all ${filterKey === flagKey ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'}`}
                                            >
                                                {flagKey} {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {filteredLogs.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-sm">Tidak ada event</div>
                        ) : filteredLogs.map((log) => (
                            <button
                                key={log.id}
                                onClick={() => setSelectedLog(log)}
                                className={`w-full px-5 py-3.5 flex items-start gap-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left ${selectedLog?.id === log.id ? 'bg-indigo-50 dark:bg-[#4F46E5]/10 border-l-2 border-l-[#4F46E5]' : ''}`}
                            >
                                <div className={`w-8 h-8 rounded-lg ${severityBg(log.flag?.severity ?? 0)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                    {log.flag?.severity ?? 0}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-2 py-0.5 rounded-lg">
                                        {log.flagKey}
                                    </span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                                        {log.flag?.label || log.flagKey}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── KANAN: Screenshot + Detail ── */}
                <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col flex-1 overflow-hidden">
                    {selectedLog ? (
                        <>
                            {/* Nav */}
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
                            <div className="bg-slate-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0" style={{ height: '50%' }}>
                                {selectedLog.attachment?.file ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT || process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}${selectedLog.attachment.file}`}
                                        alt="screenshot"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <span className="text-sm text-slate-400">Tidak ada screenshot</span>
                                )}
                            </div>

                            {/* Detail */}
                            <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1">
                                <div className="grid grid-cols-2 gap-5">
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

                                {(selectedLog.attachment?.url || selectedLog.attachment?.desc) && (
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Detail</p>
                                        <p className="text-sm text-blue-500 italic break-all">
                                            {selectedLog.attachment?.url || selectedLog.attachment?.desc}
                                        </p>
                                    </div>
                                )}

                                {!["CONNECT", "DISCONNECT"].includes(selectedLog.flagKey) && (
                                    <div className="mt-auto pt-2">
                                        <ConfirmLogButton
                                            callback={() => setUpdateLog(p => p + 1)}
                                            id={selectedLog.id}
                                            currentLogType={selectedLog.logType || "System"}
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
}