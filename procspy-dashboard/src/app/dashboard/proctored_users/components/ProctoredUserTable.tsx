"use client"
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HistoryIcon, PlusIcon, Search, Pencil, Trash2, Upload, ArrowUpDown, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import session from "../../../../lib/session";
import { useModal } from "../../../../context/ModalProvider";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import TitleModal from "../../../../components/ui/modal/TitleModal";
import AlertModal from "../../../../components/ui/AlertModal";
import BodyModal from "../../../../components/ui/modal/BodyModal";
import * as XLSX from "xlsx";

export type ProctoredUser = {
    id: string
    name: string
    email: string
    identifier: string
};

type SortOption = "default" | "nama-az" | "nama-za" | "nrp-az" | "nrp-za"

// ── Modal Form User ──
const UserFormModal = ({
    user, onSubmit, onClose,
}: {
    user?: ProctoredUser | null
    onSubmit: (identifier: string, name: string, email: string) => void
    onClose: () => void
}) => {
    const identifierRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
            `}</style>
            <div className="absolute inset-0 bg-black/40" style={{ animation: 'backdropIn 0.2s ease' }} />
            <div style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
                className="relative z-10 bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-10 w-full max-w-lg mx-4 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">{user ? "Edit User" : "Tambah User Baru"}</h2>
                    <p className="text-sm text-slate-400 mt-1">Isi data user di bawah ini. Klik di luar untuk batal.</p>
                </div>
                <div className="flex flex-col gap-5">
                    {[
                        { label: "NRP", ref: identifierRef, placeholder: "Masukan NRP", defaultValue: user?.identifier, type: "text" },
                        { label: "Nama", ref: nameRef, placeholder: "Masukan nama lengkap", defaultValue: user?.name, type: "text" },
                        { label: "Email", ref: emailRef, placeholder: "Masukan email", defaultValue: user?.email, type: "email" },
                    ].map(({ label, ref, placeholder, defaultValue, type }) => (
                        <div key={label} className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</label>
                            <input ref={ref} type={type} placeholder={placeholder} defaultValue={defaultValue || ""}
                                className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                        </div>
                    ))}
                </div>
                <button onClick={() => onSubmit(identifierRef.current?.value || "", nameRef.current?.value || "", emailRef.current?.value || "")}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all active:scale-95">
                    Simpan
                </button>
            </div>
        </div>
    )
}

// ── Modal Generate Session ──
const GenerateSessionModal = ({
    userId, rooms, onSubmit, onClose,
}: {
    userId: string; rooms: any[]; onSubmit: (roomId: string) => void; onClose: () => void
}) => {
    const roomRef = useRef<HTMLSelectElement>(null)
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={onClose}>
            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
            `}</style>
            <div className="absolute inset-0 bg-black/40" style={{ animation: 'backdropIn 0.2s ease' }} />
            <div style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
                className="relative z-10 bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-10 w-full max-w-lg mx-4 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}>
                <div className="text-center">
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">Generate Session</h2>
                    <p className="text-sm text-slate-400 mt-1">Pilih ruangan untuk sesi ujian. Klik di luar untuk batal.</p>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Ruangan</label>
                    <select ref={roomRef} className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all">
                        <option value="">Pilih ruangan</option>
                        {rooms?.map(room => (
                            <option key={room.id} value={room.roomId} className="dark:text-slate-700">
                                {room.roomId} {room.title ? `- ${room.title}` : ""}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={() => onSubmit(roomRef.current?.value || "")}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all active:scale-95">
                    Generate
                </button>
            </div>
        </div>
    )
}

// ── Modal Import Excel ──
type ImportRow = { nrp: string; nama: string; email: string; status?: 'pending' | 'success' | 'error'; error?: string }

const ImportModal = ({
    onClose,
    onDone,
}: {
    onClose: () => void
    onDone: () => void
}) => {
    const fileRef = useRef<HTMLInputElement>(null)
    const [rows, setRows] = useState<ImportRow[]>([])
    const [importing, setImporting] = useState(false)
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const data = new Uint8Array(ev.target?.result as ArrayBuffer)
            const wb = XLSX.read(data, { type: 'array' })
            const ws = wb.Sheets[wb.SheetNames[0]]
            const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })
            const parsed: ImportRow[] = json.map(row => ({
                nrp:   String(row['NRP'] || row['nrp'] || row['Nrp'] || '').trim(),
                nama:  String(row['Nama'] || row['nama'] || row['NAMA'] || '').trim(),
                email: String(row['Email'] || row['email'] || row['EMAIL'] || '').trim(),
                status: 'pending' as const,
            })).filter(r => r.nrp || r.nama)
            setRows(parsed)
        }
        reader.readAsArrayBuffer(file)
    }

    const handleImport = async () => {
        setImporting(true)
        const jwt = await session()
        let count = 0
        const updated = [...rows]
        for (let i = 0; i < updated.length; i++) {
            const row = updated[i]
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-user`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
                    body: JSON.stringify({ identifier: row.nrp, name: row.nama, email: row.email }),
                })
                updated[i] = { ...row, status: res.ok ? 'success' : 'error', error: res.ok ? undefined : 'Gagal' }
            } catch {
                updated[i] = { ...row, status: 'error', error: 'Network error' }
            }
            count++
            setProgress(Math.round((count / updated.length) * 100))
            setRows([...updated])
        }
        setImporting(false)
        setDone(true)
        onDone()
    }

    const successCount = rows.filter(r => r.status === 'success').length
    const errorCount = rows.filter(r => r.status === 'error').length

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center" onClick={!importing ? onClose : undefined}>
            <style>{`
                @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
                @keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
            `}</style>
            <div className="absolute inset-0 bg-black/40" style={{ animation: 'backdropIn 0.2s ease' }} />
            <div style={{ animation: 'modalIn 0.25s cubic-bezier(0.16,1,0.3,1)' }}
                className="relative z-10 bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-8 w-full max-w-2xl mx-4 flex flex-col gap-5"
                onClick={e => e.stopPropagation()}>

                <div className="text-center">
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">Import Excel</h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Upload file Excel dengan format kolom:{" "}
                        <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 rounded">NRP</span>,{" "}
                        <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 rounded">Nama</span>,{" "}
                        <span className="font-mono bg-slate-100 dark:bg-white/10 px-1 rounded">Email</span>
                    </p>
                    <button
                        onClick={() => {
                            const wb = XLSX.utils.book_new();
                            const ws = XLSX.utils.aoa_to_sheet([
                                ['NRP', 'Nama', 'Email'],
                                ['5123500001', 'Contoh Nama', 'contoh@email.com'],
                            ]);
                            XLSX.utils.book_append_sheet(wb, ws, 'Peserta');
                            XLSX.writeFile(wb, 'template-peserta.xlsx');
                        }}
                        className="mt-2 text-xs text-[#4F46E5] hover:underline flex items-center gap-1 mx-auto"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download template di sini
                    </button>
                </div>

                {/* Upload area */}
                {rows.length === 0 && (
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all"
                    >
                        <Upload size={32} className="text-slate-400" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Klik untuk upload file Excel</p>
                        <p className="text-xs text-slate-400">.xlsx atau .xls</p>
                        <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
                    </div>
                )}

                {/* Preview & progress */}
                {rows.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-300 font-medium">{rows.length} data ditemukan</span>
                            {done && (
                                <span className="text-xs text-slate-400">
                                    <span className="text-green-600 font-medium">{successCount} berhasil</span>
                                    {errorCount > 0 && <span className="text-red-500 font-medium ml-2">{errorCount} gagal</span>}
                                </span>
                            )}
                        </div>

                        {importing && (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Mengimpor...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#4F46E5] rounded-full transition-all" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100 dark:border-white/10
                            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300">
                            <table className="min-w-full text-xs">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/10">
                                    <tr>
                                        {["NRP", "Nama", "Email", "Status"].map(h => (
                                            <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, i) => (
                                        <tr key={i} className="border-b border-slate-50 dark:border-white/5">
                                            <td className="px-4 py-2 text-slate-700 dark:text-white">{row.nrp}</td>
                                            <td className="px-4 py-2 text-slate-700 dark:text-white">{row.nama}</td>
                                            <td className="px-4 py-2 text-slate-500">{row.email}</td>
                                            <td className="px-4 py-2">
                                                {row.status === 'pending' && <span className="text-slate-400">—</span>}
                                                {row.status === 'success' && <CheckCircle2 size={14} className="text-green-500" />}
                                                {row.status === 'error' && <XCircle size={14} className="text-red-500" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    {!done && rows.length > 0 && (
                        <button
                            onClick={handleImport}
                            disabled={importing}
                            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {importing ? <><Loader2 size={15} className="animate-spin" /> Mengimpor...</> : <><Upload size={15} /> Import {rows.length} Data</>}
                        </button>
                    )}
                    {done && (
                        <button onClick={onClose}
                            className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all active:scale-95">
                            Selesai
                        </button>
                    )}
                    {!importing && (
                        <button onClick={onClose}
                            className="px-5 py-3 rounded-xl text-sm font-medium border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                            {done ? 'Tutup' : 'Batal'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Main Component ──
const ProctoredUserTable = () => {
    const [proctoredUsers, setProctoredUsers] = useState<ProctoredUser[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [rooms, setRooms] = useState(null)
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState<SortOption>("default")
    const [showSort, setShowSort] = useState(false)

    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState<ProctoredUser | null>(null)
    const [showGenerateForm, setShowGenerateForm] = useState(false)
    const [generatingUserId, setGeneratingUserId] = useState<string | null>(null)
    const [showImport, setShowImport] = useState(false)
    const [sessionExistsMap, setSessionExistsMap] = useState<Record<string, boolean>>({})
    const [sessionRefresh, setSessionRefresh] = useState(0)

    const pathname = usePathname()
    const router = useRouter()
    const { openModal, closeModal } = useModal()

    useEffect(() => { fetchProctoredUsers(1); fetchRooms(); }, []);

    useEffect(() => {
        if (proctoredUsers.length === 0) return;
        const fetchSessionsForUsers = async () => {
            try {
                const token = await session();
                const results = await Promise.all(
                    proctoredUsers.map(async (u) => {
                        const res = await fetch(
                            `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/sessions/${u.id}?page=1&paginationLimit=10`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (res.ok) {
                            const data = await res.json();
                            const hasActive = data.data?.some((s: any) => {
                                const st = String(s.status).toLowerCase()
                                return st === "ongoing" || st === "1" || st === "active" || st === "paused" || st === "3" || st === "scheduled" || st === "0"
                            })
                            return { id: u.id, hasSession: hasActive };
                        }
                        return { id: u.id, hasSession: false };
                    })
                );
                const map: Record<string, boolean> = {};
                results.forEach(r => { map[r.id] = r.hasSession; });
                setSessionExistsMap(map);
            } catch (err) { console.error("Failed to fetch sessions", err); }
        };
        fetchSessionsForUsers();
    }, [proctoredUsers, sessionRefresh]);

    const fetchProctoredUsers = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-users?page=${nextPage}&paginationLimit=100`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setProctoredUsers(prev => {
                    const newUsers = data.data.filter((d: ProctoredUser) => !prev.some(p => p.id === d.id));
                    return [...prev, ...newUsers];
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false);
                setPage(nextPage);
            }
        } catch (err) { console.error("Failed to fetch proctored users", err); }
    };

    const fetchRooms = async () => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/rooms`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { const { data } = await res.json(); setRooms(data); }
        } catch (err) { console.error("Failed to fetch rooms", err); }
    }

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) fetchProctoredUsers(page + 1);
    };

    const handleDeleteProctoredUser = async (id: string) => {
        openModal(
            <ConfirmModal onConfirm={() => deleteProctoredUser(id)} confirmText="Ya, Hapus" cancelText="Batal">
                <TitleModal>Hapus User?</TitleModal>
                <BodyModal><p className="text-sm text-slate-500 dark:text-slate-400">User ini akan dihapus permanen.</p></BodyModal>
            </ConfirmModal>
        )
    }

    const deleteProctoredUser = async (id: string) => {
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-user/${id}`,
                { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` } })
            if (response.ok) {
                setProctoredUsers([]); fetchProctoredUsers(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const addProctoredUser = async ({ identifier, name, email }: { identifier: string; name: string; email: string }) => {
        setShowUserForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-user`,
                { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ identifier, name, email }) })
            const data = await response.json()
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setProctoredUsers([]); fetchProctoredUsers(1)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved {data.error}</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const editProctoredUser = async ({ id, identifier, name, email }: { id: string; identifier: string; name: string; email: string }) => {
        setShowUserForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-user`,
                { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ id, identifier, name, email }) })
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setProctoredUsers([]); fetchProctoredUsers(1)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const generateSession = async (id: string, roomId: string) => {
        setShowGenerateForm(false)
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || "https://202.10.34.67:5050"}/api/session/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ proctoredUserId: id, roomId }),
            });
            const data = await res.json()
            if (res.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Session Generated!</p></BodyModal></AlertModal>)
                setSessionRefresh(p => p + 1)
                setTimeout(() => closeModal(), 1000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not created {data.error}</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const sortLabels: Record<SortOption, string> = {
        "default": "Default",
        "nama-az": "Nama A→Z",
        "nama-za": "Nama Z→A",
        "nrp-az":  "NRP Terkecil",
        "nrp-za":  "NRP Terbesar",
    }

    const filtered = proctoredUsers
        .filter(u =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.identifier.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a, b) => {
            switch (sortBy) {
                case "nama-az": return a.name.localeCompare(b.name)
                case "nama-za": return b.name.localeCompare(a.name)
                case "nrp-az":  return a.identifier.localeCompare(b.identifier, undefined, { numeric: true })
                case "nrp-za":  return b.identifier.localeCompare(a.identifier, undefined, { numeric: true })
                default: return 0
            }
        })

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {showUserForm && (
                <UserFormModal
                    user={editingUser}
                    onClose={() => setShowUserForm(false)}
                    onSubmit={(identifier, name, email) =>
                        editingUser
                            ? editProctoredUser({ id: editingUser.id, identifier, name, email })
                            : addProctoredUser({ identifier, name, email })
                    }
                />
            )}
            {showGenerateForm && generatingUserId && (
                <GenerateSessionModal
                    userId={generatingUserId}
                    rooms={rooms || []}
                    onClose={() => setShowGenerateForm(false)}
                    onSubmit={(roomId) => generateSession(generatingUserId, roomId)}
                />
            )}
            {showImport && (
                <ImportModal
                    onClose={() => setShowImport(false)}
                    onDone={() => { setProctoredUsers([]); fetchProctoredUsers(1); }}
                />
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Kelola User</h1>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input type="text" placeholder="Search Users..." value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full" />
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSort(v => !v)}
                            className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-medium px-4 py-2.5 rounded-xl hover:border-[#4F46E5] hover:text-[#4F46E5] transition-all"
                        >
                            <ArrowUpDown size={15} />
                            {sortLabels[sortBy]}
                        </button>
                        {showSort && (
                            <div className="absolute top-12 right-0 z-20 bg-white dark:bg-[#0f0f13] border border-slate-100 dark:border-white/10 rounded-xl shadow-xl p-2 min-w-[160px]"
                                style={{ animation: 'filterIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
                                <style>{`@keyframes filterIn { from { opacity:0; transform:scale(0.95) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
                                {(Object.keys(sortLabels) as SortOption[]).map(key => (
                                    <button key={key}
                                        onClick={() => { setSortBy(key); setShowSort(false) }}
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${sortBy === key ? 'bg-[#4F46E5] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                        {sortLabels[key]}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Import Excel */}
                    <button
                        onClick={() => setShowImport(true)}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                    >
                        <Upload size={15} />
                        Import Excel
                    </button>

                    {/* Add User */}
                    <button
                        onClick={() => { setEditingUser(null); setShowUserForm(true) }}
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                    >
                        <PlusIcon size={16} />
                        Add User
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
                                    {["Nama", "NRP", "Email", "Generate Session", "Kelola"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-400 text-sm">
                                            {search ? "Tidak ada hasil untuk pencarian ini" : "Tidak ada data"}
                                        </td>
                                    </tr>
                                ) : filtered.map((user: ProctoredUser) => (
                                    <tr key={user.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700 dark:text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.identifier}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {sessionExistsMap[user.id] ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 text-xs font-medium px-3 py-1.5 rounded-lg">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                                        Sesi aktif
                                                    </span>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                const jwt = await session()
                                                                // Fetch session token aktif milik user ini
                                                                const res = await fetch(
                                                                    `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/sessions/${user.id}?page=1&paginationLimit=1`,
                                                                    { headers: { Authorization: `Bearer ${jwt}` } }
                                                                )
                                                                if (!res.ok) return
                                                                const data = await res.json()
                                                                const sessionToken = data.data?.[0]?.token
                                                                if (!sessionToken) return
                                                                // End session via proctor endpoint
                                                                await fetch(
                                                                    `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/session/update-status-proctor/${sessionToken}/completed`,
                                                                    { headers: { Authorization: `Bearer ${jwt}` } }
                                                                )
                                                                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Session ended</p></BodyModal></AlertModal>)
                                                                setSessionRefresh(p => p + 1)
                                                                setTimeout(() => closeModal(), 1500)
                                                            } catch {
                                                                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
                                                                setTimeout(() => closeModal(), 2000)
                                                            }
                                                        }}
                                                        className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 dark:border-red-500/30 hover:border-red-500 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all"
                                                        title="End Session"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                                                        End
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => { setGeneratingUserId(user.id); setShowGenerateForm(true) }}
                                                    className="flex items-center gap-1.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all">
                                                    <PlusIcon size={12} /> Generate
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => router.push(pathname + "/" + user.id + "/sessions/")}
                                                    className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 transition-all"
                                                    title="Riwayat Session">
                                                    <HistoryIcon size={14} />
                                                </button>
                                                <button onClick={() => { setEditingUser(user); setShowUserForm(true) }}
                                                    className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 transition-all"
                                                    title="Edit">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDeleteProctoredUser(user.id)}
                                                    className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-red-400 hover:text-red-500 text-slate-400 transition-all"
                                                    title="Hapus">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {filtered.length > 0 && (
                    <div className="px-6 py-3 border-t border-slate-50 dark:border-white/5 text-xs text-slate-400">
                        Showing {filtered.length} user{filtered.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProctoredUserTable;
