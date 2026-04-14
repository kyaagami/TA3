import { SideSheetProvider } from "../../context/SideSheetProvider"
import SideBar from "./components/SideBar"
import Header from "./components/Header"

export default function DashboardLayout({ children }) {
    return (
        <section className="min-h-screen flex flex-col dark:bg-gradient-to-r dark:from-black dark:to-slate-900/70">
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