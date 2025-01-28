export function stringOrEmpty(value: string | undefined | null): string {
    if (value) {
        return value
    }
    return ""
}