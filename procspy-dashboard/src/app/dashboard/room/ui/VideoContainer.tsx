"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { useWebRtc } from "../../../../context/WebRtcProvider"
import { FlagIcon, Headphones, HeadphoneOff, Volume2Icon, VolumeOffIcon } from "lucide-react"
import { useLogBottomSheet } from "../../../../context/LogBottomSheetProvider"

const VideoContainer = ({ consumer, displayName, displayId }: { consumer: any, displayName?: string, displayId?: string }) => {
    const router = useRouter()
    const { data, notificationCount } = useWebRtc()
    const { setData } = useLogBottomSheet()

    const videoRef = useRef<HTMLVideoElement>(null)
    const camRef = useRef<HTMLVideoElement>(null)
    const audioRef = useRef<HTMLAudioElement>(null)
    const micRef = useRef<HTMLAudioElement>(null)

    const [audioMute, setAudioMute] = useState(true)
    const [micMute, setMicMute] = useState(true)
    const [micTrack, setMicTrack] = useState<MediaStreamTrack | null>(null)
    const [isSpeaking, setIsSpeaking] = useState(false)

    // Audio detection via AnalyserNode
    useEffect(() => {
        if (!micTrack) return;
        const stream = new MediaStream([micTrack]);
        const audioCtx = new AudioContext();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        let animId: number;
        const update = () => {
            analyser.getByteTimeDomainData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const val = (dataArray[i] - 128) / 128;
                sum += val * val;
            }
            const rms = Math.sqrt(sum / dataArray.length);
            setIsSpeaking(rms > 0.02)
            animId = requestAnimationFrame(update);
        };
        update();
        return () => { cancelAnimationFrame(animId); audioCtx.close(); };
    }, [micTrack]);

    useEffect(() => {
        if (consumer?.consumers?.length) prepareConsume(consumer)
    }, [consumer])

    const tryPlayMedia = (ref: React.RefObject<HTMLVideoElement | HTMLAudioElement>, label: string) => {
        if (ref.current && ref.current.srcObject) {
            ref.current.play().catch(err => console.warn(`${label} autoplay failed:`, err))
        }
    }

    const setStream = (ref: React.RefObject<HTMLVideoElement | HTMLAudioElement>, stream: MediaStream) => {
        if (ref.current && ref.current.srcObject !== stream) {
            ref.current.srcObject = null
            ref.current.srcObject = stream
        }
    }

    const prepareConsume = (consumer: any) => {
        consumer.consumers.forEach((element: any) => {
            const name = element.appData?.name
            const track = element.consumer.track
            if (!track || !(track instanceof MediaStreamTrack) || track.readyState !== "live") return
            const stream = new MediaStream([track])
            switch (name) {
                case "video": setStream(videoRef, stream); tryPlayMedia(videoRef, "Video"); break
                case "cam": setStream(camRef, stream); tryPlayMedia(camRef, "Cam"); break
                case "audio":
                    setStream(audioRef, stream)
                    if (audioRef.current) audioRef.current.muted = audioMute
                    tryPlayMedia(audioRef, "Audio"); break
                case "mic":
                    setMicTrack(track)
                    setStream(micRef, stream)
                    if (micRef.current) micRef.current.muted = micMute
                    tryPlayMedia(micRef, "Mic"); break
                default: break
            }
        })
    }

    useEffect(() => {
        const enableAutoplay = () => {
            tryPlayMedia(videoRef, "Video"); tryPlayMedia(audioRef, "Audio")
            tryPlayMedia(camRef, "Cam"); tryPlayMedia(micRef, "Mic")
        }
        document.addEventListener("click", enableAutoplay, { once: true })
        return () => {
            [videoRef, camRef, audioRef, micRef].forEach(ref => {
                if (ref.current?.srcObject) {
                    (ref.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
                    ref.current.srcObject = null
                }
            })
        }
    }, [])

    // toggleMic: mute/unmute mendengar mic peserta
    const toggleMic = () => {
        setMicMute(prev => {
            const muted = !prev
            if (micRef.current) { micRef.current.muted = muted; if (!muted) tryPlayMedia(micRef, "Mic") }
            return muted
        })
    }

    // toggleAudio: mute/unmute mendengar audio screen share peserta
    const toggleAudio = () => {
        setAudioMute(prev => {
            const muted = !prev
            if (audioRef.current) { audioRef.current.muted = muted; if (!muted) tryPlayMedia(audioRef, "Audio") }
            return muted
        })
    }

    const handleFocusMode = () => router.push(`/dashboard/room/${data.roomId}/${consumer.socketId}`)
    const handleToggleLogBottomSheet = () => setData((prev: any) => ({ active: !prev.active, token: consumer.token }))

    const flagCount = notificationCount.find((n: any) => n.token === consumer.token)?.count || 0
    const name = displayName || consumer.proctored_user?.name || "Peserta"
    const id = displayId || consumer.proctored_user?.identifier || consumer.token

    return (
        <div className={`bg-white dark:bg-white/5 rounded-2xl border-2 transition-all duration-200 overflow-hidden
            ${isSpeaking ? 'border-[#4F46E5] shadow-lg shadow-[#4F46E5]/20' : 'border-slate-100 dark:border-white/10'}`}>

            {/* Header */}
            <div className="px-4 pt-4 pb-2 flex items-start justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{name}</p>
                    <p className="text-xs text-slate-400">ID: {id}</p>
                </div>
                <button onClick={handleFocusMode}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                        <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                    </svg>
                </button>
            </div>

            {/* Videos */}
            <div className="px-4 flex gap-2">
                <div className="flex-1 aspect-video bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <video autoPlay playsInline ref={videoRef} className="w-full h-full object-cover" />
                    {!videoRef.current?.srcObject && (
                        <span className="absolute text-xs text-slate-400">Screen share</span>
                    )}
                </div>
                <div className="w-[35%] aspect-video bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <video autoPlay playsInline ref={camRef} className="w-full h-full object-cover"
                        onDoubleClick={() => camRef.current?.requestFullscreen()} />
                    {!camRef.current?.srcObject && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 absolute">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    )}
                </div>
            </div>

            <audio ref={audioRef} />
            <audio ref={micRef} />

            {/* Bottom buttons */}
            <div className="px-4 py-3 flex items-center justify-center gap-2">
                {/* Flag / Log */}
                <button onClick={handleToggleLogBottomSheet}
                    className="relative w-10 h-10 rounded-xl bg-[#1B2A6B] hover:bg-[#243580] text-white flex items-center justify-center transition-all active:scale-95">
                    {flagCount > 0 && <div className="absolute w-2.5 h-2.5 bg-red-500 -top-1 -right-1 rounded-full" />}
                    <FlagIcon size={15} />
                </button>
                {/* Dengar mic peserta */}
                <button onClick={toggleMic}
                    className="w-10 h-10 rounded-xl bg-[#1B2A6B] hover:bg-[#243580] text-white flex items-center justify-center transition-all active:scale-95">
                    {micMute ? <VolumeOffIcon size={15} /> : <Volume2Icon size={15} />}
                </button>
                {/* Dengar audio screen share */}
                <button onClick={toggleAudio}
                    className="w-10 h-10 rounded-xl bg-[#1B2A6B] hover:bg-[#243580] text-white flex items-center justify-center transition-all active:scale-95">
                    {audioMute ? <HeadphoneOff size={15} /> : <Headphones size={15} />}
                </button>
            </div>
        </div>
    )
}

export default React.memo(VideoContainer)