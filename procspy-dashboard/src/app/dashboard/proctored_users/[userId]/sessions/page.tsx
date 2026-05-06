'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import session from "../../../../../lib/session";
import SessionTable from "./components/SessionTable";

export default function Page() {
    const { userId } = useParams()
    const [userName, setUserName] = useState<string>("")

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const token = await session()
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/proctored-users?page=1&paginationLimit=100`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                if (res.ok) {
                    const data = await res.json()
                    const user = data.data.find((u: any) => u.id === userId)
                    if (user) setUserName(user.name)
                }
            } catch (err) {
                console.error("Failed to fetch user name", err)
            }
        }
        if (userId) fetchUserName()
    }, [userId])

    return (
        <section className="h-full flex flex-col isolate isolate">
            <SessionTable userName={userName} />
        </section>
    )
}