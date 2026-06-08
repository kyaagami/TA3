'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatBox from '../../../ui/ChatBox';
import { ConsumerData, useWebRtc } from '../../../../../context/WebRtcProvider';
import { ChevronDown, ChevronUp, Headphones, Square, Volume2Icon, VolumeOffIcon } from 'lucide-react';
import LogsWindow from './components/LogsWindow';
import { useModal } from '../../../../../context/ModalProvider';
import AlertModal from '../../../../../components/ui/AlertModal';
import TitleModal from '../../../../../components/ui/modal/TitleModal';
import BodyModal from '../../../../../components/ui/modal/BodyModal';
import { SessionDetailProps } from './components/DeviceInfoWindow';
import session from '../../../../../lib/session';
import { SessionResultProps } from '../users/components/UserSessionTable';

type UserInfo = { session_detail: SessionDetailProps; [key: string]: any };

const FRAUD_BADGE: Record<string, string> = {
    CRITICAL: "bg-red-50 text-red-600 border border-red-200",
    HIGH:     "bg-orange-50 text-orange-600 border border-orange-200",
    MEDIUM:   "bg-amber-50 text-amber-600 border border-amber-200",
    LOW:      "bg-green-50 text-green-600 border border-green-200",
}

export default function Page() {
    const { roomId, socketId } = useParams();
    const router = useRouter();
    const { peers, setData, socketRef, notificationCount, privateMessages, setPrivateMessages } = useWebRtc();

    const [userInfo, setUserInfo]             = useState<UserInfo | null>(null);
    const [sessionResult, setSessionResult]   = useState<SessionResultProps | null>(null);
    const [showDeviceInfo, setShowDeviceInfo] = useState(false);
    const [displayName, setDisplayName]       = useState('...');
    const [displayNRP, setDisplayNRP]         = useState('-');

    const videoRef = useRef<HTMLVideoElement>(null);
    const camRef   = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const micRef   = useRef<HTMLAudioElement>(null);

    const [audioMute, setAudioMute] = useState(true);
    const [micMute,   setMicMute]   = useState(true);

    const { openModal, closeModal } = useModal();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        if (socketId && roomId)
            setData(prev => ({ ...prev, roomId: roomId as string, singleConsumerSocketId: socketId as string }));
    }, [roomId, socketId]);

    useEffect(() => { if (peers?.[0]) prepareConsume(peers[0].consumers); }, [peers]);

    useEffect(() => {
        if (peers?.[0]?.token) {
            fetchUserInfo(peers[0].token);
            fetchName(peers[0].token);
        }
    }, [peers]);

    useEffect(() => {
        const t = peers?.[0]?.token;
        if (t && notificationCount.some(e => e.token === t)) fetchSessionResult(t);
    }, [notificationCount, peers]);

    const fetchUserInfo = async (token: string) => {
        try {
            const jwt = await session();
            const r = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/proctored-user/${token}`, { headers: { Authorization: `Bearer ${jwt}` } });
            if (r.ok) { const { data } = await r.json(); setUserInfo(data); fetchSessionResult(token); }
        } catch {}
    };

    const fetchName = async (sessionToken: string) => {
        try {
            const jwt = await session();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/sessions-in-room/${roomId}?page=1&paginationLimit=100`,
                { headers: { Authorization: `Bearer ${jwt}` } }
            );
            if (!res.ok) return;
            const data = await res.json();
            const s = data.data.find((x: any) => x.token === sessionToken);
            if (s?.proctored_user) {
                setDisplayName(s.proctored_user.name || '...');
                setDisplayNRP(s.proctored_user.identifier || '-');
            }
        } catch {}
    };

    const fetchSessionResult = async (token: string) => {
        try {
            const jwt = await session();
            const r = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://202.10.34.67:5050'}/api/session-result-token/${token}`, { headers: { Authorization: `Bearer ${jwt}` } });
            if (r.ok) { const d = await r.json(); setSessionResult(d); }
        } catch {}
    };

    const prepareConsume = (consumers: ConsumerData[]) => {
        consumers.forEach(({ appData, consumer }) => {
            const track = consumer.track;
            if (!track || !(track instanceof MediaStreamTrack)) return;
            const s = new MediaStream([track]);
            switch (appData?.name) {
                case 'video': if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.muted = true; } break;
                case 'audio': if (audioRef.current) { audioRef.current.srcObject = s; audioRef.current.muted = audioMute; } break;
                case 'cam':   if (camRef.current)   { camRef.current.srcObject   = s; camRef.current.muted   = true; } break;
                case 'mic':   if (micRef.current)   { micRef.current.srcObject   = s; micRef.current.muted   = micMute; } break;
            }
        });
    };

    const toggleAudio = () => setAudioMute(p => {
        const m = !p;
        if (audioRef.current) { audioRef.current.muted = m; if (!m) audioRef.current.play().catch(() => {}); }
        return m;
    });

    const toggleMic = () => setMicMute(p => {
        const m = !p;
        if (micRef.current) { micRef.current.muted = m; if (!m) micRef.current.play().catch(() => {}); }
        return m;
    });

    const handleEndSession = () => {
        const token = peers?.[0]?.token;
        if (!token || !socketRef.current) return;
        socketRef.current.emit("DASHBOARD_SERVER_MESSAGE", {
            data: {
                action: "ABORT_PROCTORING",
                token,
                roomId,
                state: "completed",
                error: ":Proctor completed the session"
            }
        }, (data: any) => {
            if (data?.success) {
                openModal(
                    <AlertModal>
                        <TitleModal>Success</TitleModal>
                        <BodyModal><p className="text-sm dark:text-slate-300">Session ended</p></BodyModal>
                    </AlertModal>
                );
                setTimeout(() => { closeModal(); router.push(`/dashboard/room/${roomId}`); }, 1500);
            } else {
                openModal(
                    <AlertModal>
                        <TitleModal>Failed</TitleModal>
                        <BodyModal><p className="text-sm dark:text-slate-300">Cannot end session that has not started yet</p></BodyModal>
                    </AlertModal>
                );
                setTimeout(() => closeModal(), 2000);
            }
        });
    };

    const handleSend = (text: string) => {
        const token = peers?.[0]?.token;
        if (!token) return;
        setPrivateMessages(prev => {
            const i = prev.findIndex(m => m.token === token);
            if (i !== -1) { const u = [...prev]; u[i].messages.push({ from: 'you', text }); return u; }
            return [...prev, { token, messages: [{ from: 'you', text }] }];
        });
        socketRef.current?.emit('DASHBOARD_SERVER_MESSAGE', { data: { action: 'SEND_CHAT', token, roomId, body: text } });
    };

    const peerToken  = peers?.[0]?.token;
    const fraudLevel = sessionResult?.fraudLevel || 'LOW';

    return (
        <div className="p-8 pb-4 bg-[#F7F8FA] dark:bg-transparent flex flex-col gap-4" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

            {/* Header */}
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h1 className="font-bold text-2xl text-slate-800 dark:text-white">Monitor Ujian</h1>
                    <div className="flex items-center gap-1 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span className="text-sm">{displayName}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/dashboard/room/${roomId}`)}
                        className="w-10 h-10 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-all active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="8 3 3 3 3 8"/><polyline points="21 8 21 3 16 3"/>
                            <polyline points="3 16 3 21 8 21"/><polyline points="16 21 21 21 21 16"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleEndSession}
                        className="h-10 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
                    >
                        <Square size={13} /> End Session
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex gap-4 flex-1 min-h-0">

                {/* KIRI */}
                <div className="flex flex-col gap-4 flex-1 min-h-0">

                    {/* Video row */}
                    <div className="flex gap-4 flex-shrink-0" style={{ height: '440px' }}>
                        {/* Screen share */}
                        <div className="flex-1 h-full bg-slate-200 dark:bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain" />
                        </div>
                        {/* Face cam + tombol */}
                        <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: '384px' }}>
                            <div className="bg-slate-200 dark:bg-slate-900 rounded-2xl overflow-hidden flex-1">
                                <video ref={camRef} autoPlay playsInline className="w-full h-full object-cover" />
                            </div>
                            <div className="flex justify-center gap-3 flex-shrink-0" style={{ height: '44px' }}>
                                <button onClick={toggleMic} className="w-11 h-11 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-all active:scale-95">
                                    {micMute ? <VolumeOffIcon size={15}/> : <Volume2Icon size={15}/>}
                                </button>
                                <button onClick={toggleAudio} className="w-11 h-11 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white flex items-center justify-center transition-all active:scale-95">
                                    <Headphones size={15}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Log Peringatan */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col flex-1 min-h-0 overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 dark:border-white/10 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                    <line x1="12" y1="9" x2="12" y2="13"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                <span className="font-semibold text-sm text-slate-800 dark:text-white">Peringatan</span>
                            </div>
                            <span className={"text-xs font-semibold px-2.5 py-1 rounded-lg " + (FRAUD_BADGE[fraudLevel] || FRAUD_BADGE.LOW)}>
                                {fraudLevel}
                            </span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-track]:bg-white/5 dark:[&::-webkit-scrollbar-thumb]:bg-white/20 [&>div]:!h-full [&>div>div]:!h-full [&>div>div]:!max-h-none">
                            {peerToken && <LogsWindow token={peerToken} />}
                        </div>
                    </div>
                </div>

                {/* KANAN */}
                <div className="flex flex-col gap-4 flex-shrink-0 min-h-0" style={{ width: '280px' }}>

                    {/* Info peserta */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 p-5 flex flex-col gap-3 flex-shrink-0">
                        <p className="font-semibold text-slate-800 dark:text-white">{displayName}</p>
                        <div className="flex flex-col gap-2 text-xs">
                            {[{ l: 'NRP', v: displayNRP }, { l: 'Token', v: peerToken }].map(({ l, v }) => (
                                <div key={l} className="flex items-start gap-2">
                                    <span className="text-slate-400 w-10 flex-shrink-0">{l}</span>
                                    <span className="text-slate-400">:</span>
                                    <span className="text-slate-700 dark:text-white break-all">{v || '-'}</span>
                                </div>
                            ))}
                        </div>
                        {userInfo?.session_detail && (
                            <div className="border-t border-slate-100 dark:border-white/10 pt-3">
                                <button
                                    onClick={() => setShowDeviceInfo(v => !v)}
                                    className="flex items-center justify-between w-full text-xs font-medium text-slate-700 dark:text-white"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                                            <line x1="8" y1="21" x2="16" y2="21"/>
                                            <line x1="12" y1="17" x2="12" y2="21"/>
                                        </svg>
                                        Device Info
                                    </span>
                                    {showDeviceInfo ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                                </button>
                                {showDeviceInfo && (
                                    <div className="mt-2 flex flex-col gap-1.5 text-xs">
                                        {[
                                            { l: 'Browser', v: userInfo.session_detail.browser + ' ' + userInfo.session_detail.browserVersion },
                                            { l: 'OS',      v: userInfo.session_detail.operatingSystem },
                                            { l: 'IP',      v: userInfo.session_detail.ipAddress },
                                            { l: 'CPU',     v: userInfo.session_detail.cpuModel },
                                            { l: 'RAM',     v: userInfo.session_detail.ramSize },
                                        ].filter(i => i.v).map(({ l, v }) => (
                                            <div key={l} className="flex gap-2">
                                                <span className="w-14 flex-shrink-0 text-slate-400">{l}</span>
                                                <span className="text-slate-700 dark:text-white break-all">{v}</span>
                                            </div>
                                        ))}
                                        {userInfo.session_detail.isVM && (
                                            <span className="text-red-500 font-medium">Running in VM</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Chat */}
                    <div className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 flex-1 min-h-0 overflow-hidden">
                        <ChatBox
                            user={{ name: 'user#' + (peerToken ?? '') }}
                            privateMessages={privateMessages.filter(m => m.token === peerToken)}
                            onSendMessage={handleSend}
                        />
                    </div>
                </div>
            </div>

            <audio ref={audioRef} autoPlay />
            <audio ref={micRef}   autoPlay />
        </div>
    );
}