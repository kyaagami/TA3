"use client"
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlusIcon, Search, Pencil, ToggleLeft, ToggleRight, Eye, EyeOff } from "lucide-react";
import session from "../../../../lib/session";
import { useModal } from "../../../../context/ModalProvider";
import TitleModal from "../../../../components/ui/modal/TitleModal";
import AlertModal from "../../../../components/ui/AlertModal";
import BodyModal from "../../../../components/ui/modal/BodyModal";

export type Proctor = {
    id: string
    name: string
    email: string
    username: string
    active?: boolean
    createdAt?: string
};

// ── Modal Form Proctor ──
const ProctorFormModal = ({
    proctor,
    isRegister,
    onSubmit,
    onClose,
}: {
    proctor?: Proctor | null
    isRegister: boolean
    onSubmit: (data: { username: string; name: string; email: string; password?: string }) => void
    onClose: () => void
}) => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const nameRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)

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
                        {isRegister ? "Tambah Proctor Baru" : "Edit Proctor"}
                    </h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Isi data proctor di bawah ini. Klik di luar untuk batal.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Username</label>
                        <input ref={usernameRef} type="text" placeholder="Masukan username" defaultValue={proctor?.username || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama</label>
                        <input ref={nameRef} type="text" placeholder="Masukan nama lengkap" defaultValue={proctor?.name || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</label>
                        <input ref={emailRef} type="email" placeholder="Masukan email" defaultValue={proctor?.email || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all" />
                    </div>
                    {isRegister && (
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</label>
                            <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus-within:border-[#4F46E5] focus-within:ring-2 focus-within:ring-[#4F46E5]/20 transition-all">
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukan password"
                                    className="flex-1 px-4 py-3 text-sm bg-transparent text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={() => onSubmit({
                        username: usernameRef.current?.value || "",
                        name: nameRef.current?.value || "",
                        email: emailRef.current?.value || "",
                        password: passwordRef.current?.value || "",
                    })}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all duration-200 active:scale-95"
                >
                    Simpan
                </button>
            </div>
        </div>
    )
}

const ProctorTable = () => {
    const [proctors, setProctors] = useState<Proctor[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingProctor, setEditingProctor] = useState<Proctor | null>(null)
    const [isRegister, setIsRegister] = useState(false)

    const { openModal, closeModal } = useModal()

    useEffect(() => {
        fetchProctor(1);
    }, []);

    const fetchProctor = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/users?page=${nextPage}&paginationLimit=20`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setProctors(prev => {
                    const newProctors = data.data.filter((d: Proctor) => !prev.some(p => p.id === d.id));
                    return [...prev, ...newProctors];
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to fetch proctors", err);
        }
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchProctor(page + 1);
        }
    };

    const addProctor = async ({ username, name, email, password }: { username: string; name: string; email: string; password?: string }) => {
        setShowForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/register`,
                { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ username, name, email, password }) }
            )
            const data = await response.json()
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                fetchProctor(1)
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

    const editProctor = async ({ id, username, name, email }: { id: string; username: string; name: string; email: string }) => {
        setShowForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/user`,
                { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ id, username, name, email }) }
            )
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setProctors([])
                fetchProctor(1)
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

    const activateUser = async (id: string) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/activate-user/${id}`, {
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            });
            const data = await res.json()
            if (res.ok) {
                setProctors([])
                fetchProctor(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Account Activated!</p></BodyModal></AlertModal>)
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

    const filtered = proctors.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.username.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {/* Modal */}
            {showForm && (
                <ProctorFormModal
                    proctor={editingProctor}
                    isRegister={isRegister}
                    onClose={() => setShowForm(false)}
                    onSubmit={(data) =>
                        isRegister
                            ? addProctor(data)
                            : editProctor({ id: editingProctor!.id, ...data })
                    }
                />
            )}

            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Proctor Accounts</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Proctors..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                        />
                    </div>
                    <button
                        onClick={() => { setEditingProctor(null); setIsRegister(true); setShowForm(true) }}
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                    >
                        <PlusIcon size={16} />
                        Add Proctor
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
                                    {["Nama", "Username", "Email", "Status", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            {h}
                                        </th>
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
                                ) : (
                                    filtered.map((user: Proctor) => (
                                        <tr key={user.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                                                        {user.name?.charAt(0)?.toUpperCase() || "?"}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700 dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.username}</td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => activateUser(user.id)}
                                                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200
                                                        ${user.active
                                                            ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100'
                                                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                                                        }`}
                                                >
                                                    {user.active
                                                        ? <><ToggleRight size={14} /> Aktif</>
                                                        : <><ToggleLeft size={14} /> Nonaktif</>
                                                    }
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => { setEditingProctor(user); setIsRegister(false); setShowForm(true) }}
                                                    className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 dark:text-slate-500 transition-all duration-200"
                                                >
                                                    <Pencil size={14} />
                                                </button>
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
                        Showing {filtered.length} proctor{filtered.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProctorTable;