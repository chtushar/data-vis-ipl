export const setXFromIndex = (index: number) => {
    return Math.floor(index / 20) * 20
}

export const setYFromIndex = (index: number) => {
    return index % 20 * 20
}
