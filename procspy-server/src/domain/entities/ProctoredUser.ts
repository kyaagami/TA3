export type ProctoredUserProps = {
    id: string
    name: string
    email: string
    identifier: string
    createdAt: string
    updatedAt?: string
    deletedAt?: string
}

export class ProctoredUser {
    public readonly id: string
    public readonly name: string
    public readonly email: string
    public readonly identifier: string
    public readonly createdAt: string
    public readonly updatedAt?: string
    public readonly deletedAt?: string

    constructor(props: ProctoredUserProps) {
        this.id = props.id
        this.name = props.name
        this.email = props.email
        this.identifier = props.identifier 
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.deletedAt = props.deletedAt
    }
}
