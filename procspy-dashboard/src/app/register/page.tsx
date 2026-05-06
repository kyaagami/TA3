"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ArrowLeft, User, Mail, Phone, Building2, Briefcase, Users, MessageSquare, CheckCircle } from "lucide-react"
import emailjs from "@emailjs/browser"

const SERVICE_ID  = "service_qpu2ss3"
const TEMPLATE_ID = "template_0p00613"
const PUBLIC_KEY  = "kDxHztbI9qM8K7GPO"

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setErrorMessage("")

        const formData = new FormData(e.currentTarget)

        const templateParams = {
            from_name:    formData.get("from_name")?.toString() || "",
            from_email:   formData.get("from_email")?.toString() || "",
            phone:        formData.get("phone")?.toString() || "",
            institution:  formData.get("institution")?.toString() || "",
            role:         formData.get("role")?.toString() || "",
            participants: formData.get("participants")?.toString() || "",
            message:      formData.get("message")?.toString() || "",
        }

        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
            setSuccess(true)
        } catch (err) {
            console.error(err)
            setErrorMessage("Gagal mengirim permintaan. Coba lagi.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden py-10">
            {/* Background */}
            <Image
                fill
                alt="background"
                src="/image/BG LOGIN.png"
                style={{ objectFit: "cover" }}
                priority
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-indigo-500/60"
                style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease" }}
            />

            {/* Blobs */}
            <div className="absolute top-10 left-10 w-64 h-64 bg-indigo-400/40 rounded-full blur-2xl"
                style={{ transform: mounted ? "scale(1)" : "scale(0.5)", opacity: mounted ? 1 : 0, transition: "transform 1.2s ease, opacity 1.2s ease" }}
            />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-400/40 rounded-full blur-2xl"
                style={{ transform: mounted ? "scale(1)" : "scale(0.5)", opacity: mounted ? 1 : 0, transition: "transform 1.2s ease 0.2s, opacity 1.2s ease 0.2s" }}
            />

            {/* Back button */}
            <a href="/"
                className="absolute top-5 left-5 z-20 flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-200"
                style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(-20px)", transition: "opacity 0.6s ease 0.4s, transform 0.6s ease 0.4s" }}
            >
                <ArrowLeft className="w-4 h-4" />
                Kembali
            </a>

            {/* Card */}
            <div
                className="relative z-10 bg-gray-50 rounded-2xl shadow-2xl px-10 py-10 w-full max-w-lg mx-4"
                style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)", transition: "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s" }}
            >
                {!success ? (
                    <>
                        <h1 className="text-center text-2xl font-extrabold text-indigo-900 mb-1"
                            style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.5s ease 0.5s, transform 0.5s ease 0.5s" }}
                        >
                            Request Akun ProcSpy
                        </h1>
                        <p className="text-center text-sm text-gray-400 mb-8"
                            style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.5s ease 0.6s" }}
                        >
                            Isi form berikut, kami akan menghubungi kamu setelah akun siap
                        </p>

                        <form onSubmit={onSubmit} className="flex flex-col gap-4">
                            {/* Nama */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <User className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="text" name="from_name" placeholder="Masukan nama lengkap" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Email</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="email" name="from_email" placeholder="Masukan email" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* No HP */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">No HP</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="tel" name="phone" placeholder="Masukan nomor HP" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* Institusi */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Institusi</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="text" name="institution" placeholder="Nama sekolah/universitas" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* Jabatan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Jabatan</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="text" name="role" placeholder="Guru, Dosen, Staff IT, dll" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* Jumlah Peserta */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Perkiraan Jumlah Peserta</label>
                                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <Users className="w-4 h-4 text-indigo-400 shrink-0" />
                                    <input type="number" name="participants" placeholder="Contoh: 30" min="1" required
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none" />
                                </div>
                            </div>

                            {/* Pesan */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Pesan Tambahan</label>
                                <div className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                                    <MessageSquare className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                                    <textarea name="message" placeholder="Keterangan tambahan (opsional)" rows={3}
                                        className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-300 outline-none resize-none" />
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-xs text-red-500 italic -mt-1">{errorMessage}</p>
                            )}

                            <button type="submit" disabled={isLoading}
                                className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white font-semibold text-base rounded-xl py-3.5 transition-colors duration-200 shadow-md shadow-indigo-200 mt-1"
                            >
                                {isLoading ? "Mengirim..." : "Kirim Permintaan"}
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Sudah punya akun?{" "}
                                <a href="/login" className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors">
                                    Masuk sekarang
                                </a>
                            </p>
                        </form>
                    </>
                ) : (
                    /* Success state */
                    <div className="flex flex-col items-center gap-5 py-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-indigo-900">Permintaan Terkirim!</h2>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Terima kasih! Kami akan menghubungi kamu melalui email setelah akun siap digunakan.
                        </p>
                        <a href="/"
                            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors"
                        >
                            Kembali ke Beranda
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}