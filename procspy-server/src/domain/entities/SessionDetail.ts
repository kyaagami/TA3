type Storage = {
    id: string
    capacity: string
    type: string
}

type Display = {
    name: string
    height: string
    width: string
    isPrimary: boolean
}

export type SessionDetailProps = {
    id: string
    sessionId: string
    deviceId: string
    operatingSystem: string
    userAgent: string
    ipAddress: string
    cpuModel: string
    cpuArch: string
    primaryDisplay: string
    browser: string
    browserVersion: string
    cpuNumOfProcessors: number
    gpu?: string
    ramSize?: string
    storages?: Array<Storage>
    displays?: Array<Display>
    isVM?: boolean
}

export class SessionDetail {
    public readonly id: string
    public readonly sessionId: string
    public readonly deviceId: string
    public readonly operatingSystem: string
    public readonly userAgent: string
    public readonly ipAddress: string
    public readonly cpuModel: string
    public readonly cpuArch: string
    public readonly primaryDisplay: string
    public readonly browser: string
    public readonly browserVersion: string
    public readonly gpu?: string
    public readonly ramSize?: string
    public readonly storages?: Array<Storage>
    public readonly displays?: Array<Display>
    public readonly isVM?: boolean

    constructor(props: SessionDetailProps) {
        this.id = props.id
        this.sessionId = props.sessionId
        this.deviceId = props.deviceId
        this.operatingSystem = props.operatingSystem
        this.userAgent = props.userAgent
        this.ipAddress = props.ipAddress
        this.cpuModel = props.cpuModel
        this.cpuArch = props.cpuArch
        this.primaryDisplay = props.primaryDisplay
        this.browser = props.browser
        this.browserVersion = props.browserVersion
        this.gpu = props.gpu
        this.ramSize = props.ramSize
        this.storages = props.storages
        this.displays = props.displays
        this.isVM = props.isVM
    }
}
