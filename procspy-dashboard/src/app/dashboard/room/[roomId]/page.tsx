'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VideoContainer from '../ui/VideoContainer'
import { useWebRtc } from '../../../../context/WebRtcProvider'
import { useLogBottomSheet } from '../../../../context/LogBottomSheetProvider'
import LogsWindow from './[socketId]/components/LogsWindow'
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import session from '../../../../lib/session'

const ITEMS_PER_PAGE = 6

type SortOption = 'default' | 'nama-az' | 'nama-za' | 'nrp-asc' | 'nrp-desc'

const sortLabels: Record<SortOption, string> = {
    'default':  'Default',
    'nama-az':  'Nama A→Z',
    'nama-za':  'Nama Z→A',
    'nrp-asc':  'NRP Terkecil',
    'nrp-desc': 'NRP Terbesar',
}

const Page = () => {
    const { roomId } = useParams()
    const { connected, peers, setData: setWebRtcData } = useWebRtc()
    const { data } = useLogBottomSheet()
    const [currentPage, setCurrentPage] = useState(1)
    const [sessionMap, setSessionMap] = useState<Record<string, { name: string; identifier: string }>>({})
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const [showSort, setShowSort] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    useEffect(() => {
        if (connected) return;
        if (roomId) setWebRtcData({ roomId: roomId as string, singleConsumerSocketId: null })
    }, [roomId])

    useEffect(() => {
        if (!roomId) return;
        const fetchSessions = async () => {
            try {
                const token = await session()
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/sessions-in-room/${roomId}?page=1&paginationLimit=100`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (res.ok) {
                    const data = await res.json()
                    const map: Record<string, { name: string; identifier: string }> = {}
                    data.data.forEach((s: any) => {
                        map[s.token] = {
                            name: s.proctored_user?.name || "Peserta",
                            identifier: s.proctored_user?.identifier || s.token,
                        }
                    })
                    setSessionMap(map)
                }
            } catch (err) { console.error("Failed to fetch sessions", err) }
        }
        fetchSessions()
        const interval = setInterval(fetchSessions, 10000)
        return () => clearInterval(interval)
    }, [roomId])

    // Filter + Sort peers
    const filteredPeers = peers
        .filter(consumer => {
            const info = sessionMap[consumer.token]
            const q = search.toLowerCase()
            return !q ||
                (info?.name || '').toLowerCase().includes(q) ||
                (info?.identifier || '').toLowerCase().includes(q) ||
                consumer.token.toLowerCase().includes(q)
        })
        .sort((a, b) => {
            const aInfo = sessionMap[a.token]
            const bInfo = sessionMap[b.token]
            switch (sortBy) {
                case 'nama-az': return (aInfo?.name || '').localeCompare(bInfo?.name || '')
                case 'nama-za': return (bInfo?.name || '').localeCompare(aInfo?.name || '')
                case 'nrp-asc': return (aInfo?.identifier || '').localeCompare(bInfo?.identifier || '', undefined, { numeric: true })
                case 'nrp-desc': return (bInfo?.identifier || '').localeCompare(aInfo?.identifier || '', undefined, { numeric: true })
                default: return 0
            }
        })

    const totalPages = Math.ceil(filteredPeers.length / ITEMS_PER_PAGE)
    const paginatedPeers = filteredPeers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    // Reset page saat search/sort berubah
    useEffect(() => { setCurrentPage(1) }, [search, sortBy])

    return (
        <div className="relative h-screen overflow-hidden bg-[#F7F8FA] dark:bg-transparent flex flex-col">

            {data.active && (
                <div className="fixed z-40 w-full bottom-0 border-t border-white/15 dark:bg-black">
                    <LogsWindow canDrag={true} token={data.token} />
                </div>
            )}

            <div className="p-8 flex flex-col gap-6 flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between flex-shrink-0">
                    <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Monitor Ujian</h1>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 w-56">
                            <Search size={15} className="text-slate-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search nama, NRP..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="bg-transparent text-sm text-slate-700 dark:text-white placeholder:text-slate-400 focus:outline-none w-full"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSort(v => !v)}
                                className={`flex items-center gap-2 border text-sm font-medium px-3 py-2.5 rounded-xl transition-all ${sortBy !== 'default' ? 'bg-[#4F46E5] text-white border-[#4F46E5]' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-[#4F46E5] hover:text-[#4F46E5]'}`}
                            >
                                <ArrowUpDown size={14} />
                                {sortLabels[sortBy]}
                            </button>
                            {showSort && (
                                <div className="absolute top-12 right-0 z-20 bg-white dark:bg-[#0f0f13] border border-slate-100 dark:border-white/10 rounded-xl shadow-xl p-2 min-w-[160px]"
                                    style={{ animation: 'filterIn 0.2s cubic-bezier(0.16,1,0.3,1)' }}>
                                    <style>{`@keyframes filterIn { from { opacity:0; transform:scale(0.95) translateY(-8px); } to { opacity:1; transform:scale(1) translateY(0); } }`}</style>
                                    {(Object.keys(sortLabels) as SortOption[]).map(k => (
                                        <button key={k} onClick={() => { setSortBy(k); setShowSort(false) }}
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${sortBy === k ? 'bg-[#4F46E5] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                                            {sortLabels[k]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {peers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                        Menunggu peserta bergabung...
                    </div>
                ) : filteredPeers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                        Tidak ada peserta yang cocok dengan pencarian
                    </div>
                ) : (
                    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 flex-1 overflow-hidden content-start">
                            {paginatedPeers.map((consumer: any) => (
                                <VideoContainer
                                    key={consumer.token}
                                    consumer={consumer}
                                    displayName={sessionMap[consumer.token]?.name}
                                    displayId={sessionMap[consumer.token]?.identifier}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 flex-shrink-0">
                                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center disabled:opacity-30 hover:bg-[#4F46E5] hover:text-white transition-all">
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {currentPage}/{totalPages}
                                </span>
                                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center disabled:opacity-30 hover:bg-[#4F46E5] hover:text-white transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Page
