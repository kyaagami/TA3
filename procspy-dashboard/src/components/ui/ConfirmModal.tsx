import { ReactNode } from "react"
import { useModal } from "../../context/ModalProvider"

interface ConfirmModalProps {
    children: ReactNode
    onConfirm: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
}

const ConfirmModal = ({
    children,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ConfirmModalProps) => {
    const { closeModal } = useModal()

    const handleConfirm = () => {
        onConfirm()
        closeModal()
    }

    const handleCancel = () => {
        if (onCancel) onCancel()
        closeModal()
    }

    return (
        <div
            style={{ animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
            className="
                bg-white dark:bg-[#0f0f13]
                rounded-2xl shadow-2xl
                border border-slate-100 dark:border-white/10
                p-8 max-w-md min-w-[360px] mx-auto
                flex flex-col gap-5
            "
        >
            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>

            {/* Icon */}
            <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
            </div>

            {/* Content */}
            <div className="text-center">
                {children}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-1">
                <button
                    onClick={handleCancel}
                    className="
                        flex-1 px-5 py-2.5 rounded-xl text-sm font-medium
                        bg-slate-100 dark:bg-white/5
                        text-slate-600 dark:text-slate-300
                        hover:bg-slate-200 dark:hover:bg-white/10
                        border border-slate-200 dark:border-white/10
                        transition-all duration-200 active:scale-95
                    "
                >
                    {cancelText}
                </button>
                <button
                    onClick={handleConfirm}
                    className="
                        flex-1 px-5 py-2.5 rounded-xl text-sm font-medium
                        bg-[#4F46E5] hover:bg-[#4338CA]
                        text-white
                        shadow-lg shadow-[#4F46E5]/25
                        transition-all duration-200 active:scale-95
                    "
                >
                    {confirmText}
                </button>
            </div>
        </div>
    )
}

export default ConfirmModal