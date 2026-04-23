"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

export default function Page() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [mounted, setMounted] = useState(false)

    const router = useRouter()

    useEffect(() => {
        // Trigger entrance animation after mount
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formObject: Record<string, string> = {}
            const formData = new FormData(e.currentTarget)
            formData.forEach((value, key) => {
                formObject[key] = value.toString();
            });
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/login`, {
                method: 'POST',
                body: JSON.stringify(formObject),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            })

            const data = await response.json()
            if (response.ok) {
                if (data.authenticationToken) {
                    router.push('/dashboard')
                } else {
                    setErrorMessage(data.error)
                }
            } else {
                setErrorMessage(data.error)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden">
            {/* Background Image */}
            <Image
                fill
                alt="background"
                src="/image/BG LOGIN.png"
                style={{ objectFit: "cover" }}
                priority
            />

            {/* Purple overlay */}
            <div
                className="absolute inset-0 bg-indigo-500/60"
                style={{
                    opacity: mounted ? 1 : 0,
                    transition: "opacity 0.8s ease",
                }}
            />

            {/* Decorative blobs */}
            <div
                className="absolute top-10 left-10 w-64 h-64 bg-indigo-400/40 rounded-full blur-2xl"
                style={{
                    transform: mounted ? "scale(1)" : "scale(0.5)",
                    opacity: mounted ? 1 : 0,
                    transition: "transform 1.2s ease, opacity 1.2s ease",
                }}
            />
            <div
                className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/40 rounded-full blur-2xl"
                style={{
                    transform: mounted ? "scale(1)" : "scale(0.5)",
                    opacity: mounted ? 1 : 0,
                    transition: "transform 1.2s ease 0.2s, opacity 1.2s ease 0.2s",
                }}
            />
            <div className="absolute top-1/2 left-8 w-40 h-40 bg-white/10 rounded-full blur-xl" />

            {/* Back Button — top-left corner */}
            <a
                href="https://procspy.my.id/"
                className="absolute top-5 left-5 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(-20px)",
                    transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s",
                }}
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </a>

            {/* Card */}
            <div
                className="relative z-10 bg-gray-50 rounded-2xl shadow-2xl px-10 py-10 w-full max-w-md mx-4"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
                    transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s",
                }}
            >
                {/* Title */}
                <h1
                    className="text-center text-2xl font-extrabold text-indigo-900 mb-1"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(12px)",
                        transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s",
                    }}
                >
                    Masuk ke ProcSpy
                </h1>
                <p
                    className="text-center text-sm text-gray-400 mb-8 leading-snug"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s",
                    }}
                >
                    Sistem Pengawasan Ujian Online<br />Terpercaya
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-5">
                    {/* Email Field */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? "translateY(0)" : "translateY(12px)",
                            transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s",
                        }}
                    >
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Masukan email Anda"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? "translateY(0)" : "translateY(12px)",
                            transition: "opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s",
                        }}
                    >
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Masukan Password Anda"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div
                        className="flex items-center gap-2"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transition: "opacity 0.5s ease 0.9s",
                        }}
                    >
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 accent-indigo-600 cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer select-none">
                            Ingat saya
                        </label>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-xs text-red-500 italic -mt-2">{errorMessage}</p>
                    )}

                    {/* Submit Button */}
                    <div
                        style={{
                            opacity: mounted ? 1 : 0,
                            transform: mounted ? "translateY(0)" : "translateY(10px)",
                            transition: "opacity 0.5s ease 1s, transform 0.5s ease 1s",
                        }}
                    >
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-base rounded-xl py-3.5 transition-colors duration-200 shadow-md shadow-indigo-200"
                        >
                            <LogIn className="w-5 h-5" />
                            {isLoading ? 'Memuat...' : 'Masuk'}
                        </button>
                    </div>

                    {/* Register Link */}
                    <p
                        className="text-center text-sm text-gray-500"
                        style={{
                            opacity: mounted ? 1 : 0,
                            transition: "opacity 0.5s ease 1.1s",
                        }}
                    >
                        Belum punya akun?{" "}
                        <a href="/register" className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                            Daftar sekarang
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}