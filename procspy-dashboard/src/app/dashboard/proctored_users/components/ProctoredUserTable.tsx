"use client"
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HistoryIcon, PlusIcon, Search, Pencil, Trash2 } from "lucide-react";
import session from "../../../../lib/session";
import { useModal } from "../../../../context/ModalProvider";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import TitleModal from "../../../../components/ui/modal/TitleModal";
import AlertModal from "../../../../components/ui/AlertModal";
import BodyModal from "../../../../components/ui/modal/BodyModal";

export type ProctoredUser = {
    id: string
    name: string
    email: string
    identifier: string
};

// ── Modal Form User ──
const UserFormModal = ({
    user,
    onSubmit,
    onClose,
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
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">
                        {user ? "Edit User" : "Tambah User Baru"}
                    </h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Isi data user di bawah ini. Klik di luar untuk batal.
                    </p>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">NRP</label>
                        <input ref={identifierRef} type="text" placeholder="Masukan NRP" defaultValue={user?.identifier || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama</label>
                        <input ref={nameRef} type="text" placeholder="Masukan nama lengkap" defaultValue={user?.name || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input ref={emailRef} type="email" placeholder="Masukan email" defaultValue={user?.email || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                </div>

                <button
                    onClick={() => onSubmit(identifierRef.current?.value || "", nameRef.current?.value || "", emailRef.current?.value || "")}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all duration-200 active:scale-95"
                >
                    Simpan
                </button>
            </div>
        </div>
    )
}

// ── Modal Generate Session ──
const GenerateSessionModal = ({
    userId,
    rooms,
    onSubmit,
    onClose,
}: {
    userId: string
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
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">Generate Session</h2>
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
                    Generate
                </button>
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

    const [showUserForm, setShowUserForm] = useState(false)
    const [editingUser, setEditingUser] = useState<ProctoredUser | null>(null)
    const [showGenerateForm, setShowGenerateForm] = useState(false)
    const [generatingUserId, setGeneratingUserId] = useState<string | null>(null)

    const pathname = usePathname()
    const router = useRouter()
    const { openModal, closeModal } = useModal()

    useEffect(() => {
        fetchProctoredUsers(1);
        fetchRooms()
    }, []);

    const fetchProctoredUsers = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-users?page=${nextPage}&paginationLimit=20`, {
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
        } catch (err) {
            console.error("Failed to fetch proctored users", err);
        }
    };

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
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        }
    }

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchProctoredUsers(page + 1);
        }
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-user/${id}`,
                { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` } }
            )
            if (response.ok) {
                setProctoredUsers([])
                fetchProctoredUsers(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch (error) {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const addProctoredUser = async ({ identifier, name, email }: { identifier: string, name: string, email: string }) => {
        setShowUserForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-user`,
                { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ identifier, name, email }) }
            )
            const data = await response.json()
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setProctoredUsers([])
                fetchProctoredUsers(1)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved {data.error}</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch (error) {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const editProctoredUser = async ({ id, identifier, name, email }: { id: string, identifier: string, name: string, email: string }) => {
        setShowUserForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-user`,
                { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ id, identifier, name, email }) }
            )
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setProctoredUsers([])
                fetchProctoredUsers(1)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Failed</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data not saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch (error) {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 2000)
        }
    }

    const generateSession = async (id: string, roomId: string) => {
        setShowGenerateForm(false)
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || "https://192.168.43.85:5050"}/api/session/`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ proctoredUserId: id, roomId }),
            });
            const data = await res.json()
            if (res.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Session Generated!</p></BodyModal></AlertModal>)
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

    const filtered = proctoredUsers.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.identifier.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {/* Modals */}
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

            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Kelola User</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Users..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingUser(null); setShowUserForm(true) }}
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                    >
                        <PlusIcon size={16} />
                        Add User
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
                                    {["Nama", "NRP", "Email", "Generate Session", "Sessions", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-slate-400 text-sm">
                                            {search ? "Tidak ada hasil untuk pencarian ini" : "Tidak ada data"}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((user: ProctoredUser) => (
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
                                                <button
                                                    onClick={() => { setGeneratingUserId(user.id); setShowGenerateForm(true) }}
                                                    className="flex items-center gap-1.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                                                >
                                                    <PlusIcon size={12} />
                                                    Generate
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => router.push(pathname + "/" + user.id + "/sessions/")}
                                                    className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 hover:bg-[#4F46E5] text-slate-600 dark:text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                                                >
                                                    <HistoryIcon size={12} />
                                                    Riwayat
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => { setEditingUser(user); setShowUserForm(true) }}
                                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 dark:text-slate-500 transition-all duration-200"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProctoredUser(user.id)}
                                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-red-400 hover:text-red-500 text-slate-400 dark:text-slate-500 transition-all duration-200"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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