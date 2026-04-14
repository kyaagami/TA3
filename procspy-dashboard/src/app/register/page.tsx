"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, LogIn, ArrowLeft, User, AtSign } from "lucide-react"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage('')

        try {
            const formData = new FormData(e.currentTarget)
            const body = {
                username: formData.get('username')?.toString() || '',
                name: formData.get('name')?.toString() || '',
                email: formData.get('email')?.toString() || '',
                password: formData.get('password')?.toString() || '',
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://10.252.130.112:5050'}/api/register`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            })

            const data = await response.json()
            if (response.ok) {
                router.push('/login')
            } else {
                setErrorMessage(data.error || 'Pendaftaran gagal')
            }
        } catch (e) {
            console.error(e)
            setErrorMessage('Terjadi kesalahan, coba lagi')
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
                style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease" }}
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

            {/* Back Button */}
            <a
                href="https://localhost:800"
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
                    Daftar ke ProcSpy
                </h1>
                <p
                    className="text-center text-sm text-gray-400 mb-8 leading-snug"
                    style={{
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(10px)",
                        transition: "opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s",
                    }}
                >
                    Buat akun proctor baru
                </p>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    {/* Username */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.65s, transform 0.5s ease 0.65s" }}
                    >
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <AtSign className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Masukan username"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.7s, transform 0.5s ease 0.7s" }}
                    >
                        <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <User className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Masukan nama lengkap"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.75s, transform 0.5s ease 0.75s" }}
                    >
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Masukan email"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div
                        className="flex flex-col gap-1.5"
                        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.8s, transform 0.5s ease 0.8s" }}
                    >
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                            <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Masukan password"
                                required
                                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {errorMessage && (
                        <p className="text-xs text-red-500 italic -mt-1">{errorMessage}</p>
                    )}

                    {/* Submit */}
                    <div
                        style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.5s ease 0.9s, transform 0.5s ease 0.9s" }}
                    >
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-base rounded-xl py-3.5 transition-colors duration-200 shadow-md shadow-indigo-200"
                        >
                            <LogIn className="w-5 h-5" />
                            {isLoading ? 'Mendaftar...' : 'Daftar'}
                        </button>
                    </div>

                    {/* Login link */}
                    <p
                        className="text-center text-sm text-gray-500"
                        style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 1s" }}
                    >
                        Sudah punya akun?{" "}
                        <a href="/login" className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                            Masuk sekarang
                        </a>
                    </p>
                </form>
            </div>
        </div>
    )
}
