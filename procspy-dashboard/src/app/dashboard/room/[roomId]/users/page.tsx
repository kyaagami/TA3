'use client'
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useWebRtc } from "../../../../../context/WebRtcProvider";
import UserSessionTable from "./components/UserSessionTable";

export default function Page() {
    const { roomId } = useParams()
    const { connected, setData } = useWebRtc()

    useEffect(() => {
        if (connected) return;
        setData({
            roomId: roomId as string,
            singleConsumerSocketId: null,
        });
    }, [])

    return (
        <div className="isolate">
            <UserSessionTable />
        </div>
    );
}