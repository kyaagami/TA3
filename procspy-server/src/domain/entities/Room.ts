export type RoomProps = {
    id: string
    title?: string
    roomId: string
    createdAt: string
    updatedAt?: string
    deletedAt?: string
}

export class Room {
    public readonly id: string
    
    public readonly title?: string

    public readonly roomId: string

    public readonly createdAt: string

    constructor(props: RoomProps){
        this.id = props.id
        this.title = props.title
        this.roomId = props.roomId
        this.createdAt = props.createdAt
    }
}