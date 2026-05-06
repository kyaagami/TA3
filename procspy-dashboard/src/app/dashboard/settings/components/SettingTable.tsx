"use client"
import { useEffect, useRef, useState } from "react";
import { CheckIcon, XIcon, Pencil, Settings2 } from "lucide-react";
import session from "../../../../lib/session";

export type Setting = {
    id: string
    key: string
    value: string
};

const SettingTable = () => {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    useEffect(() => {
        fetchSettings(1);
    }, []);

    const fetchSettings = async (nextPage: number) => {
        try {
            const token = await session();
            const res = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/global-settings?page=${nextPage}&paginationLimit=12`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setSettings(prev => {
                    const newSettings = data.data.filter((d: Setting) => !prev.some(p => p.id === d.id));
                    return [...prev, ...newSettings];
                });
                setLoading(false);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
            setLoading(false);
        }
    };

    const handleEditGlobalSetting = (setting: Setting) => {
        setEditingSettingId(setting.id);
        setEditValue(setting.value);
    };

    const handleSaveEdit = async (setting: Setting) => {
        try {
            const token = await session();
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT || 'https://192.168.43.85:5050'}/api/global-setting`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ key: setting.key, value: editValue }),
            });
            if (response.ok) {
                setSettings(prev => prev.map(s => s.id === setting.id ? { ...s, value: editValue } : s));
                setEditingSettingId(null);
            }
        } catch (error) {
            console.error("Failed to save edit", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingSettingId(null);
        setEditValue("");
    };

    return (
        <div className="p-8 bg-[#F7F8FA] dark:bg-transparent min-h-full">

            {/* Header */}
            <div className="mb-6">
                <h1 className="font-bold text-2xl text-slate-800 dark:text-white mb-6">Global Variable Settings</h1>
            </div>

            {/* Card list */}
            {loading ? (
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : settings.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">Tidak ada setting</div>
            ) : (
                <div className="flex flex-col gap-3">
                    {settings.map((setting) => (
                        <div
                            key={setting.id}
                            className="bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 px-6 py-5 flex items-center gap-4 transition-colors duration-200 hover:border-[#4F46E5]/20"
                        >
                            {/* Icon */}
                            <div className="w-10 h-10 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                                <Settings2 size={18} className="text-[#4F46E5]" />
                            </div>

                            {/* Key */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-700 dark:text-white font-mono">
                                    {setting.key}
                                </p>
                            </div>

                            {/* Value — inline edit */}
                            <div className="flex items-center gap-2">
                                {editingSettingId === setting.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            autoFocus
                                            className="px-3 py-2 text-sm bg-slate-50 dark:bg-white/5 border border-[#4F46E5]/40 rounded-xl text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 w-40 transition-all"
                                        />
                                        <button
                                            onClick={() => handleSaveEdit(setting)}
                                            className="p-2 rounded-lg bg-green-50 dark:bg-green-500/10 hover:bg-green-100 text-green-600 dark:text-green-400 transition-colors"
                                        >
                                            <CheckIcon size={14} />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-2 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 text-red-500 dark:text-red-400 transition-colors"
                                        >
                                            <XIcon size={14} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1.5 rounded-lg min-w-[60px] text-center">
                                            {setting.value}
                                        </span>
                                        <button
                                            onClick={() => handleEditGlobalSetting(setting)}
                                            className="p-2 rounded-lg border border-slate-200 dark:border-white/10 hover:border-[#4F46E5] hover:text-[#4F46E5] text-slate-400 dark:text-slate-500 transition-all duration-200"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SettingTable;