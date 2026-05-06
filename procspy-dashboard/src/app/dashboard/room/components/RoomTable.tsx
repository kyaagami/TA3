"use client"
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PlusIcon, Search, ScreenShareIcon, Pencil, Trash2 } from "lucide-react";
import session from "../../../../lib/session";
import { useModal } from "../../../../context/ModalProvider";
import AlertModal from "../../../../components/ui/AlertModal";
import TitleModal from "../../../../components/ui/modal/TitleModal";
import BodyModal from "../../../../components/ui/modal/BodyModal";
import ConfirmModal from "../../../../components/ui/ConfirmModal";

export type Room = {
    id: string
    roomId: string
    title?: string
};

// Modal form buat/edit ruangan
const RoomFormModal = ({
    room,
    onSubmit,
    onClose,
}: {
    room?: Room | null
    onSubmit: (roomId: string, title: string) => void
    onClose: () => void
}) => {
    const roomIdRef = useRef<HTMLInputElement>(null)
    const titleRef = useRef<HTMLInputElement>(null)

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={onClose}
        >
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

            {/* Backdrop gelap */}
            <div
                className="absolute inset-0 bg-black/40"
                style={{ animation: 'backdropIn 0.2s ease' }}
            />

            {/* Card */}
            <div
                style={{ animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
                className="relative z-10 bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-10 w-full max-w-lg mx-4 flex flex-col gap-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="text-center">
                    <h2 className="font-bold text-xl text-slate-800 dark:text-white">
                        {room ? "Edit Ruangan" : "Buat Ruangan Baru"}
                    </h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Isi detail ruangan ujian di bawah ini. Klik di luar untuk batal.
                    </p>
                </div>

                {/* Form fields */}
                <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Nama Kelas</label>
                        <input
                            ref={roomIdRef}
                            type="text"
                            placeholder="Contoh: XII-A"
                            defaultValue={room?.roomId || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Mata Pelajaran</label>
                        <input
                            ref={titleRef}
                            type="text"
                            placeholder="Contoh: Matematika"
                            defaultValue={room?.title || ""}
                            className="px-4 py-3 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 transition-all"
                        />
                    </div>
                </div>

                {/* Save button */}
                <button
                    onClick={() => onSubmit(roomIdRef.current?.value || "", titleRef.current?.value || "")}
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/25 transition-all duration-200 active:scale-95"
                >
                    Simpan
                </button>
            </div>
        </div>
    )
}

const RoomTable = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState("")
    const pathname = usePathname()
    const router = useRouter()
    const { openModal, closeModal } = useModal()

    useEffect(() => {
        fetchRooms(1);
    }, []);

    const fetchRooms = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/rooms?page=${nextPage}&paginationLimit=15`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setRooms(prev => {
                    const newRooms = data.data.filter((d: Room) => !prev.some(p => p.id === d.id));
                    return [...prev, ...newRooms];
                });
                setHasMore(nextPage < data.totalPages);
                setLoading(false);
                setPage(nextPage);
            }
        } catch (err) {
            console.error("Failed to fetch rooms", err);
        }
    };

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el || loading || !hasMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            fetchRooms(page + 1);
        }
    };

    const handleDeleteRoom = async (id: string) => {
        openModal(
            <ConfirmModal onConfirm={() => deleteRoom(id)} confirmText="Ya, Hapus" cancelText="Batal">
                <TitleModal>Hapus Ruangan?</TitleModal>
                <BodyModal><p className="text-sm text-slate-500 dark:text-slate-400">Ruangan ini akan dihapus permanen.</p></BodyModal>
            </ConfirmModal>
        )
    }

    const deleteRoom = async (id: string) => {
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/room/${id}`,
                { method: "DELETE", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` } }
            )
            if (response.ok) {
                setRooms([])
                fetchRooms(1)
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            } else {
                openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
                setTimeout(() => closeModal(), 2000)
            }
        } catch (error) {
            openModal(<AlertModal><TitleModal>Sorry</TitleModal><BodyModal><p className="text-sm dark:text-slate-300">Something went wrong</p></BodyModal></AlertModal>)
            setTimeout(() => closeModal(), 3000)
        }
    }

    const [showRoomForm, setShowRoomForm] = useState(false)
    const [editingRoom, setEditingRoom] = useState<Room | null>(null)

    const handleAddRoom = () => {
        setEditingRoom(null)
        setShowRoomForm(true)
    }

    const handleEditRoom = (room: Room) => {
        setEditingRoom(room)
        setShowRoomForm(true)
    }

    const addRoom = async ({ title, roomId }: { title?: string, roomId: string }) => {
        setShowRoomForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/room`,
                { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ title, roomId }) }
            )
            const data = await response.json()
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setRooms([])
                fetchRooms(1)
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

    const editRoom = async ({ id, roomId, title }: { id: string, roomId: string, title?: string }) => {
        setShowRoomForm(false)
        try {
            const jwt = await session()
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/room`,
                { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` }, body: JSON.stringify({ id, roomId, title }) }
            )
            if (response.ok) {
                openModal(<AlertModal><TitleModal>Success</TitleModal><BodyModal><p className="text-sm text-slate-300">Data saved</p></BodyModal></AlertModal>)
                setRooms([])
                fetchRooms(1)
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

    const filtered = rooms.filter(r =>
        r.roomId.toLowerCase().includes(search.toLowerCase()) ||
        (r.title || "").toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {/* Room Form Modal */}
            {showRoomForm && (
                <RoomFormModal
                    room={editingRoom}
                    onClose={() => setShowRoomForm(false)}
                    onSubmit={(roomId, title) =>
                        editingRoom
                            ? editRoom({ id: editingRoom.id, roomId, title })
                            : addRoom({ roomId, title })
                    }
                />
            )}

            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Ruangan Ujian</h1>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-64">
                        <Search size={16} className="text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Rooms..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                        />
                    </div>
                    <button
                        onClick={handleAddRoom}
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                    >
                        <PlusIcon size={16} />
                        Create New Room
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
                                    {["Nama Kelas", "Mata Pelajaran", "Student", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                                            {search ? "Tidak ada hasil untuk pencarian ini" : "Tidak ada ruangan"}
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((room) => (
                                        <tr key={room.id} className="border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-medium text-slate-700 dark:text-white">{room.roomId}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {room.title || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                -
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => router.push(pathname + '/' + room.roomId)}
                                                        className="flex items-center gap-1.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200"
                                                    >
                                                        <ScreenShareIcon size={12} />
                                                        Join
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditRoom(room)}
                                                        className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 dark:text-slate-500 transition-all duration-200"
                                                    >
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRoom(room.id)}
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
                        Showing {filtered.length} room{filtered.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomTable;