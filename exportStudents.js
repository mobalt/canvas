function todaysDate () {
    const today = new Date()
    let dd = today.getDate()
    let mm = today.getMonth() + 1 //January is 0!
    let yyyy = today.getFullYear()
    
    if (dd < 10) {
        dd = '0' + dd
    }
    
    if (mm < 10) {
        mm = '0' + mm
    }
    
    return mm + '-' + dd + '-' + yyyy
}

// inject button in prominent location
$('[name="enrollment_role_id"]')
    .after(' <button id="download_csv">Students [*.CSV]</button>')

// when new button is pressed, request all paginated results
// assemble, then download a *.csv file
$('#download_csv').click(function () {
    // to prevent double clicking
    $(this).attr('disabled', 'disabled')
    
    // modify current url to use api version
    const apiUrl = document.location.href.replace(/instructure.com\//i,
        '$&api/v1/')
    
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
    let filename = apiUrl.match(/\d{2,}/)[0] +
        '_students_' +
        todaysDate() +
        '.csv'
    
    // get 100 first results
    $.getJSON(apiUrl, requestPayload, onComplete)
    
    function onComplete (rows) {
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
    
})