export const setXFromIndex = (index: number) => {
    return Math.floor(index / 25) * 20
}

export const setYFromIndex = (index: number) => {
    return index % 25 * 20
}
