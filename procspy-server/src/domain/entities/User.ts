export type UserProps = {
    id: string
    name: string
    username: string
    email: string
    password: string
    active: boolean
    createdAt: string
    updatedAt?: string
    deletedAt?: string
}

export class User {
    public readonly id: string
    public readonly name: string
    public readonly username: string
    public readonly email: string
    public readonly password: string
    public readonly active: boolean
    public readonly createdAt: string
    public readonly updatedAt?: string
    public readonly deletedAt?: string

    constructor(props: UserProps) {
        this.id = props.id
        this.name = props.name
        this.username = props.username
        this.email = props.email
        this.password = props.password
        this.active = props.active
        this.createdAt = props.createdAt
        this.updatedAt = props.updatedAt
        this.deletedAt = props.deletedAt
    }
}
