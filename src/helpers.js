function pad(n, len = 2) {
    return String(n).padStart(len, '0')
}

export function today() {
    const today = new Date()

    //Having January be 0 will confuse mortals, so normalize it
    const mm = today.getMonth() + 1,
        dd = today.getDate(),
        yyyy = today.getFullYear()

    // pad the month and day with leading zeroes
    return `${pad(mm)}-${pad(dd)}-${yyyy}`
}
