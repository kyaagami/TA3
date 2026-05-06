"use client"
import { useEffect, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import session from "../../../../../../lib/session";
import { ChartLineIcon, PlusIcon, Square } from "lucide-react";
import { FraudLevel, SessionProps, SessionStatus } from "../../../../room/[roomId]/users/components/UserSessionTable";
import { useRouter } from "next/navigation";
import { useModal } from "../../../../../../context/ModalProvider";
import AlertModal from "../../../../../../components/ui/AlertModal";
import TitleModal from "../../../../../../components/ui/modal/TitleModal";
import BodyModal from "../../../../../../components/ui/modal/BodyModal";
import ConfirmModal from "../../../../../../components/ui/ConfirmModal";

// ── Fraud level badge (transparan) ──
const fraudLevelBadge = {
    [FraudLevel.CRITICAL]: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30",
    [FraudLevel.HIGH]:     "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30",
    [FraudLevel.MEDIUM]:   "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30",
    [FraudLevel.LOW]:      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30",
}

// ── Status badge (transparan) ──
const statusBadge = (status: string) => {
    switch (status) {
        case "active":
        case "ongoing":    return "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30"
        case "completed":  return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30"
        case "paused":     return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30"
        case "canceled":   return "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30"
        case "scheduled":  return "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
        default:           return "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10"
    }
}

const statusLabel = (status: string) => {
    switch (status) {
        case "active":     return "Active"
        case "ongoing":    return "Ongoing"
        case "completed":  return "Completed"
        case "paused":     return "Paused"
        case "canceled":   return "Canceled"
        case "scheduled":  return "Scheduled"
        default:           return status
    }
}

// ── Modal Add Session ──
const AddSessionModal = ({
    rooms,
    onSubmit,
    onClose,
}: {
    rooms: any[]
    onSubmit: (roomId: string) => void
    onClose: () => void
}) => {
    const roomRef = useRef<HTMLSelectElement>(null)

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes backdropIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            `}</style>
            <div className="absolute inset-0 bg-black/40" style={{ animation: 'backdropIn 0.2s ease' }} />
            <div
                style={{ animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                className="relative z-10 bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-10 w-full max-w-lg mx-4 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center">
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">Tambah Sesi Baru</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Pilih ruangan untuk sesi ujian. Klik di luar untuk batal.
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Ruangan</label>
                    <select ref={roomRef}
                        className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                    >
                        <option value="">Pilih ruangan</option>
                        {rooms?.map((room) => (
                            <option key={room.id} value={room.roomId} className="dark:text-slate-700">
                                {room.roomId} {room.title ? `- ${room.title}` : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => onSubmit(roomRef.current?.value || "")}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all duration-200 active:scale-95"
                >
                    Tambah Sesi
                </button>
            </div>
        </div>
    )
}

const SessionTable = ({ userName }: { userName: string }) => {
    const pathname = usePathname()
    const usedPathname = pathname.split("/")
    usedPathname.pop()

    const { userId } = useParams()
    const [sessions, setSessions] = useState<SessionProps[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [threshold, setThreshold] = useState(100)
    const [rooms, setRooms] = useState([])
    const [showAddSession, setShowAddSession] = useState(false)

    const { openModal, closeModal } = useModal()
    const router = useRouter()

    useEffect(() => {
        if (!userId) return;
        fetchSessions(1);
        fetchRooms()
        fetchGlobalSetting()
    }, [userId]);

    const fetchSessions = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/sessions/${userId}?page=${nextPage}&paginationLimit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setSessions(prev => {
                    const newSessions = data.data.filter((d: SessionProps) => !prev.some(p => p.token === d.token));
                    return [...prev, ...newSessions];
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        }
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchSessions(page + 1);
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

    const fetchRooms = async () => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/rooms`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const { data } = await res.json();
                setRooms(data);
            }
        } catch (err) { }
    }

    const calcFraudLevel = (totalSeverity: number) => {
        const p = (totalSeverity / threshold) * 100;
        return p >= 90 ? FraudLevel.CRITICAL : p >= 65 ? FraudLevel.HIGH : p >= 25 ? FraudLevel.MEDIUM : FraudLevel.LOW;
    }

    const handleEndSession = (token: string) => {
        openModal(
            <ConfirmModal onConfirm={() => endSession(token)} confirmText="Ya, Akhiri" cancelText="Batal">
                <TitleModal>Akhiri Sesi?</TitleModal>
                <BodyModal><p className="text-sm text-slate-500 dark:text-slate-400">Sesi ini akan ditandai sebagai selesai.</p></BodyModal>
            </ConfirmModal>
        )
    }

    const endSession = async (token: string) => {
        try {
            const jwt = await session()
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/session/update-status-proctor/${token}/completed`, {
                headers: { Authorization: `Bearer ${jwt}` },
            });
            if (res.ok) { setSessions([]); fetchSessions(1) }
        } catch (error) { }
    }

    const addSession = async (roomId: string) => {
        setShowAddSession(false)
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/session/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ proctoredUserId: userId, roomId }),
            });
            const data = await res.json()
            if (res.ok) {
                setSessions([]); fetchSessions(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Sesi berhasil ditambahkan!</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 1000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not created {data.error}</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch (err) {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {showAddSession && (
                <AddSessionModal
                    rooms={rooms}
                    onClose={() => setShowAddSession(false)}
                    onSubmit={addSession}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                    <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Riwayat Sesi / <span>{userName || "..."}</span> / Session</h1>
                <button
                    onClick={() => setShowAddSession(true)}
                    className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                >
                    <PlusIcon size={16} />
                    Add Session
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="max-h-[75vh] overflow-y-auto" onScroll={handleScroll} ref={scrollRef}>
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-white dark:bg-[#0f0f13] border-b border-slate-100 dark:border-white/10 z-10">
                                <tr>
                                    {["Session Token", "Room ID", "Start Time", "End Time", "Status", "Fraud Status", "Analytics", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-slate-400 text-sm">Tidak ada sesi</td>
                                    </tr>
                                ) : (
                                    sessions.map((s) => {
                                        const fraudLevel = s.session_result ? calcFraudLevel(s.session_result.totalSeverity) : FraudLevel.LOW
                                        return (
                                            <tr key={s.token} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-white font-mono">
                                                    {s.token}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {s.roomId || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {s.startTime || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                    {s.endTime || "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${statusBadge(s.status as unknown as string)} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>
                                                        {statusLabel(s.status as unknown as string)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`${fraudLevelBadge[fraudLevel]} text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap`}>
                                                        {fraudLevel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => router.push(usedPathname.join("/") + "/analytics/" + s.token)}
                                                        className="flex items-center gap-1.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200 whitespace-nowrap"
                                                    >
                                                        <ChartLineIcon size={12} />
                                                        Hasil
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleEndSession(s.token)}
                                                        className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-medium px-3 py-1 rounded-lg border border-red-200 dark:border-red-500/30 hover:border-red-500 transition-all duration-200 whitespace-nowrap"
                                                    >
                                                        <Square size={10} fill="currentColor" />
                                                        End
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
                        Showing {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SessionTable;