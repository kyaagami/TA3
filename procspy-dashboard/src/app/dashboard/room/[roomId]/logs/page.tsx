'use client'
import { useParams } from "next/navigation";
import LogsTable from "./components/LogsTable";
import { useEffect } from "react";
import { useWebRtc } from "../../../../../context/WebRtcProvider";

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
        <div>
            <LogsTable />
        </div>
    );
}