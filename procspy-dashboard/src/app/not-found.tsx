import Link from "next/link"

export default function NotFound() {
    return (
        <div
            className="min-h-screen w-full flex items-center justify-center"
            style={{
                backgroundImage: "url('/image/BG LOGIN.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#6B6BF5",
            }}
        >
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .card-anim { animation: fadeUp 0.5s ease forwards; }
                .float-anim { animation: float 3s ease-in-out infinite; }
            `}</style>

            {/* Card */}
            <div className="card-anim bg-white rounded-3xl shadow-2xl p-16 flex flex-col items-center gap-6 w-[520px]">

                {/* Ilustrasi 404 */}
                <div className="float-anim w-full rounded-2xl overflow-hidden">
                    <img
                        src="/image/4044.png"
                        alt="404"
                        className="w-full object-contain"
                    />
                </div>

                {/* Teks */}
                <p className="font-bold text-xl text-slate-800 text-center">
                    Looks like you've got lost....
                </p>

                {/* Tombol */}
                <Link
                    href="/dashboard"
                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold text-sm py-3 rounded-xl text-center transition-all duration-200 hover:shadow-lg hover:shadow-[#4F46E5]/25 active:scale-95"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    )
}