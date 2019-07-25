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
