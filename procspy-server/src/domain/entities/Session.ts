export enum SessionStatus {
    Scheduled = "scheduled",
    Ongoing = "ongoing",
    Completed = "completed",
    Paused = "paused",
    Canceled = "canceled",
    Aborted = "aborted",
}

export type SessionProps = {
    id: string
    roomId: string
    proctoredUserId: string
    token?: string
    startTime?: string
    endTime?: string
    status?: SessionStatus
    updatedAt?: string
    createdAt?: string
}

export class Session {
    public readonly id: string
    public readonly roomId: string
    public readonly proctoredUserId: string
    public readonly token?: string
    public readonly startTime?: string
    public readonly endTime?: string
    public readonly status?: SessionStatus
    public readonly createdAt?: string
    public readonly updatedAt?: string

    constructor(props: SessionProps) {
        this.id = props.id
        this.roomId = props.roomId
        this.token = props.token
        this.proctoredUserId = props.proctoredUserId
        this.startTime = props.startTime
        this.endTime = props.endTime
        this.status = props.status
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
    }
}


