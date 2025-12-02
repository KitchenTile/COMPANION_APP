export const formattedDate = (date: string) => {
    const d = date.substring(8, 10)
    const m = date.substring(5, 7)
    const y = date.substring(0, 4)

    const formattedDate = `${d + "/" + m + "/" + y}`

    return formattedDate;
}