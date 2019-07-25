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

function store(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(obj, resolve)
    })
}

function retrieve() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(
            ['token', 'date', 'base', 'api', 'course', 'type', 'item'],
            resolve,
        )
    })
}

const r = axios.create({
    baseURL: apiUrl,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    params: { per_page: 100 },

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: false,

    xsrfCookieName: '_csrf_token',
    xsrfHeaderName: 'X-CSRF-Token',
})
// Add a response interceptor
r.interceptors.response.use(function(response) {
    const links = parseLinks(response.headers.link)

    // For array response.data that has more results available (has a next link)
    // Go ahead and recursively fetch/concat the remaining data
    if (
        response.config.method == 'get' &&
        Array.isArray(response.data) &&
        links.next
    ) {
        console.log('Appending ', links.next)
        return r.get(links.next).then(nextResponse => {
            nextResponse.data = response.data.concat(nextResponse.data)
            return nextResponse
        })
    } else {
        // otherwise just return the unmodified original response
        return response
    }
})

function parseLinks(data) {
    let arrData = data.split('link:')
    data = arrData.length == 2 ? arrData[1] : data
    let parsed_data = {}

    arrData = data.split(',')

    for (d of arrData) {
        linkInfo = /<([^>]+)>;\s+rel="([^"]+)"/gi.exec(d)

        parsed_data[linkInfo[2]] = linkInfo[1]
    }

    return parsed_data
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
        const csvResults = [['sis_id', 'canvas_id', 'name']].concat(
            response.data,
        )

        // download *.csv file
        downloadCSV(filename, csvResults)
    },
)
