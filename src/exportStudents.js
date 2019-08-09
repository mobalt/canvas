function pad(n, len = 2) {
    return String(n).padStart(len, '0')
}
function today() {
    const today = new Date()

    //Having January be 0 will confuse mortals, so normalize it
    const mm = today.getMonth() + 1,
        dd = today.getDate(),
        yyyy = today.getFullYear()

    // pad the month and day with leading zeroes
    return `${pad(mm)}-${pad(dd)}-${yyyy}`
}


// example `7789_students_01-31-2000.csv`
const filename = `${course_id}_students_${today()}.csv`
alert(
    `Downloading student list to ${filename} Depending on class-size, might take several seconds.`,
)

// Students have enrollment_role_id == 3, filter out anyone else
r.get(`courses/${course_id}/users?per_page=100&enrollment_role_id=3`).then(
    response => {
        // console.log('Final response', response)

        // first row is header names
        const csvResults = [['canvas_id', 'sis_id', 'name']].concat(
            response.data.map(
                ({ id, sis_user_id: sis, sortable_name: name }) => [
                    id,
                    sis,
                    name,
                ],
            ),
        )

        downloadCsv(filename, csvResults)
    },
)
