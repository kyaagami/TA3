'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import VideoContainer from '../ui/VideoContainer'
import { useWebRtc } from '../../../../context/WebRtcProvider'
import { useLogBottomSheet } from '../../../../context/LogBottomSheetProvider'
import LogsWindow from './[socketId]/components/LogsWindow'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import session from '../../../../lib/session'

const ITEMS_PER_PAGE = 6

const Page = () => {
    const { roomId } = useParams()
    const { connected, peers, setData: setWebRtcData } = useWebRtc()
    const { data } = useLogBottomSheet()
    const [currentPage, setCurrentPage] = useState(1)
    const [sessionMap, setSessionMap] = useState<Record<string, { name: string; identifier: string }>>({})

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    useEffect(() => {
        if (connected) return;
        if (roomId) setWebRtcData({ roomId: roomId as string, singleConsumerSocketId: null })
    }, [roomId])

    // Fetch sessions untuk dapat nama & NRP
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
            } catch (err) {
                console.error("Failed to fetch sessions", err)
            }
        }
        fetchSessions()
        const interval = setInterval(fetchSessions, 10000)
        return () => clearInterval(interval)
    }, [roomId])

    const totalPages = Math.ceil(peers.length / ITEMS_PER_PAGE)
    const paginatedPeers = peers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

    return (
        <div className="relative h-screen overflow-hidden bg-[#F7F8FA] dark:bg-transparent flex flex-col">

            {data.active && (
                <div className="fixed z-40 w-full bottom-0 border-t border-white/15 dark:bg-black">
                    <LogsWindow canDrag={true} token={data.token} />
                </div>
            )}

            <div className="p-8 flex flex-col gap-6 flex-1 overflow-hidden">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white flex-shrink-0">
                    Monitor Ujian
                </h1>

                {peers.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                        Menunggu peserta bergabung...
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
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center disabled:opacity-30 hover:bg-[#4F46E5] hover:text-white transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    {currentPage}/{totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 rounded-full border-2 border-[#4F46E5] text-[#4F46E5] flex items-center justify-center disabled:opacity-30 hover:bg-[#4F46E5] hover:text-white transition-all"
                                >
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