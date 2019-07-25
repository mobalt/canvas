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

}

// request all paginated results
// assemble, then download a *.csv file

// modify current url to use api version
const apiUrl = document.location.href.replace(/instructure.com\//i, '$&api/v1/')

// payload object that will be used in all requests
const requestPayload = {
    per_page: 100,
    page: 1,
    // 3 = students
    enrollment_role_id: 3,
}

// first row is header names
let csvResults = [['sis_id', 'canvas_id', 'name']]

//filename = classId_students_date.csv
let filename = apiUrl.match(/\d+/)[0] + '_students_' + todaysDate() + '.csv'

// get 100 first results
$.getJSON(apiUrl, requestPayload, onComplete)

function onComplete(rows) {
    // We are not interested in all fields, just three
    // so pull those out and concat to running list
    csvResults = csvResults.concat(
        rows.map(s => [s.sis_user_id, s.id, s.sortable_name]),
    )

    // no more results available
    if (rows.length == 0) {
        // download csv results
        downloadCSV(filename, csvResults)
    } else {
        // more results ARE available
        // get next 100 results
        // and loop back through this function
        requestPayload.page++
        $.getJSON(apiUrl, requestPayload, onComplete)
    }
}
