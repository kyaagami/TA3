import { LogProps } from "../LogsWindow";
import { formattedTimestampTerminal } from "../../../../../../utils/timestamp";
import ConfirmLogButton from "../../../logs/components/ui/ConfirmLogButton";

const severityBg = (s: number) =>
    s >= 3 ? "bg-red-500" : s === 2 ? "bg-orange-400" : "bg-amber-400"

const LogComponent = ({ log }: { log: LogProps }) => {
    return (
        <div className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors`}>
            {/* Severity badge */}
            <div className={`w-7 h-7 rounded-lg ${severityBg(log.flag?.severity ?? 0)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5`}>
                {log.flag?.severity ?? 0}
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-start gap-2 flex-wrap min-w-0">
                    <span className="text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 px-2 py-0.5 rounded-lg flex-shrink-0">
                        {log.flagKey}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 break-all min-w-0 flex-1">
                        {log.flag?.label}
                        {log.attachment?.title && (
                            <span className="ml-1 bg-slate-100 dark:bg-white/10 rounded px-1 border border-slate-200 dark:border-white/10">
                                {log.attachment.title}
                            </span>
                        )}
                        {log.attachment?.url && (
                            <span className="ml-1 italic text-blue-500 break-all">{log.attachment.url}</span>
                        )}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {formattedTimestampTerminal(log.timestamp)}
                    </span>
                </div>

                {log.attachment?.file && (
                    <div className="flex items-start gap-3 mt-1">
                        <div className="max-w-[160px] aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 flex-shrink-0">
                            <img
                                className="w-full h-full object-cover"
                                src={`${process.env.NEXT_PUBLIC_STORAGE_ENDPOINT || 'https://202.10.34.67:5050'}${log.attachment.file}`}
                                alt=""
                            />
                        </div>
                        {!["CONNECT", "DISCONNECT"].includes(log.flagKey || "") && (
                            <ConfirmLogButton id={log.id} currentLogType={log.logType} />
                        )}
                    </div>
                )}

                {!log.attachment?.file && !["CONNECT", "DISCONNECT"].includes(log.flagKey || "") && (
                    <div className="mt-0.5">
                        <ConfirmLogButton id={log.id} currentLogType={log.logType} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default LogComponent;