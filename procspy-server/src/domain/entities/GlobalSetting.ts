export type GlobalSettingProps = {
    id: string
    key: string
    value: string

}

export class GlobalSetting {
    public readonly id: string
    public readonly key: string
    public readonly value: string

    constructor(props: GlobalSettingProps){
        this.id = props.id
        this.key = props.key
        this.value = props.value
    }
}