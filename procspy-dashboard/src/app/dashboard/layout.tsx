import { SideSheetProvider } from "../../context/SideSheetProvider"
import SideBar from "./components/SideBar"
import Header from "./components/Header"

export default function DashboardLayout({ children }) {
    return (
        <section className="min-h-screen flex flex-col dark:bg-gradient-to-r dark:from-black dark:to-slate-900/70 isolate">

            {/* ── Mobile blocker — hanya muncul di layar < 768px ── */}
            <div className="md:hidden fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-md px-5">
                <div className="bg-white dark:bg-[#0f0f13] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/10 p-6 w-full max-w-xs flex flex-col items-center gap-4 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <h2 className="font-bold text-base text-slate-800 dark:text-white">
                            Buka di Desktop atau Laptop
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            Dashboard ini tidak mendukung tampilan smartphone. Gunakan laptop atau PC.
                        </p>
                    </div>
                    <div className="w-full flex flex-col gap-1.5">
                        {[
                            { label: "Desktop / Laptop", ok: true },
                            { label: "Smartphone",       ok: false },
                        ].map(({ label, ok }) => (
                            <div key={label} className="flex items-center gap-2.5 bg-slate-50 dark:bg-white/5 rounded-xl px-3 py-2.5">
                                {ok ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                )}
                                <span className={`text-xs font-medium ${ok ? "text-slate-700 dark:text-slate-200" : "text-slate-400"}`}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Header full width di atas */}
            <Header />
            {/* Sidebar + konten di bawah */}
            <div className="flex flex-1">
                <SideBar />
                <SideSheetProvider>
                    <div className="w-full">
                        {children}
                    </div>
                </SideSheetProvider>
            </div>
        </section>
    )
}
