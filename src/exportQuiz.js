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
const quiz_id = item_id

// Students have enrollment_role_id == 3, filter out anyone else
r.get(`courses/${course_id}/quizzes/${quiz_id}/questions`).then(response => {
    console.log('Final response', response)
    console.log(response.data.map(cQ))

    // first row is header names
    //const csvResults = [['sis_id', 'canvas_id', 'name']].concat(
    //response.data,
    //)

    // download *.csv file
    //downloadCSV(filename, csvResults)
})
