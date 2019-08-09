import {today} from "./helpers"

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
