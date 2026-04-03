export type Validation = {
    validate: (input: any) => Error | null
}