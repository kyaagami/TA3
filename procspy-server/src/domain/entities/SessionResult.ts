export enum FraudLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

export type SessionResultProps = {
    id: string
    sessionId: string
    fraudLevel: FraudLevel
    totalFlags: number
    totalSeverity: number
    falseDetection: number
    trueSeverity: number
    updatedAt?: string
    createdAt?: string
}


export class SessionResult {
    public readonly id: string
    public readonly sessionId: string
    public readonly fraudLevel: FraudLevel
    public readonly totalFlags: number
    public readonly totalSeverity: number
    public readonly trueSeverity: number
    public readonly falseDetection: number
    public readonly updatedAt?: string
    public readonly createdAt?: string
    

    constructor(props: SessionResultProps) {
        this.id = props.id
        this.sessionId = props.sessionId
        this.fraudLevel = props.fraudLevel
        this.totalFlags = props.totalFlags
        this.totalSeverity = props.totalSeverity
        this.falseDetection = props.falseDetection
        this.trueSeverity = props.trueSeverity
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }
}