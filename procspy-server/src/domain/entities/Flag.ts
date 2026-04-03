
// export enum FlagType {
//     // Basic Connection Flags
//     UserConnected,            // User joins the session
//     UserDisconnected,         // User leaves the session

//     // Browser & Window Behavior
//     UserSwitchedTab,          // User switched to another tab/window
//     UserMinimizedWindow,      // User minimized or resized the exam window
//     UserClosedExamTab,        // User manually closed the exam tab
//     UserUsedShortcut,
//     MultipleTabsOpened,       // User opened multiple browser tabs
//     FullscreenExited,         // User exited fullscreen mode

//     // Device & External Hardware Flags
//     MultipleMonitorsDetected, // External monitors detected
//     UnauthorizedDevice,       // USB, Bluetooth, or external device connected
//     VirtualMachineDetected,   // User running on a VM (detected via OS fingerprinting)
//     EmulatorDetected,         // User using an emulator (e.g., Genymotion, BlueStacks)
//     ScreenRecordingDetected,  // Screen recording software detected
//     RemoteAccessDetected,     // Remote access software detected (e.g., TeamViewer, AnyDesk)

//     // Network & Connection Issues
//     NetworkChange,            // User switched Wi-Fi/VPN/IP mid-session
//     InternetConnectionLost,   // User lost internet connection
//     HighPacketLoss,           // Poor network connection (WebRTC high packet loss)
//     LatencyTooHigh,           // Network latency above acceptable threshold

//     // Audio & Video Monitoring
//     VideoFeedLost,            // Webcam feed lost or turned off
//     VideoManipulationDetected, // Fake webcam software detected (obs virtual cam)
//     MicrophoneMuted,          // Microphone muted unexpectedly
// }

export type FlagProps = {
    id: string
    flagKey: string
    label: string
    severity: number

}

export class Flag {
    public readonly id: string
    public readonly label: string
    public readonly flagKey: string
    public readonly severity: number

    constructor(props: FlagProps){
        this.id = props.id
        this.label = props.label
        this.flagKey = props.flagKey
        this.severity = props.severity
    }
}