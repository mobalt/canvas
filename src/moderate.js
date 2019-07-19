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

//console.log(axios)
function GET(url) {}
retrieve().then((...a) => {
    console.log(a)

    const r = axios.create({
        baseURL: 'http://fake.instructure.com/api/v1/',

        // `headers` are custom headers to be sent
        /*
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
            //'x-csrf-token': 'X2vICSYgiljSa3nGLCVKTQ+gMQX6zUMJPMYSWYa7bGsqHP9Rf2fGaIAGS6lOcSUrd5ldTZ6cN257iEo6tYxcJA=='
    },
    */
        params: { per_page: 100 },

        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
        // When no `transformRequest` is set, must be of one of the following types:
        // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
        // - Browser only: FormData, File, Blob
        // - Node only: Stream, Buffer
        //data: { firstName: 'Fred' },

        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        //timeout: 1000, // default is `0` (no timeout)

        // `withCredentials` indicates whether or not cross-site Access-Control requests
        // should be made using credentials
        withCredentials: true, // default

        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: '_csrf_token', // default

        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-CSRF-Token',

        // `maxContentLength` defines the max size of the http response content in bytes allowed
        //maxContentLength: 2000,
    })
    r.get('courses/1/quizzes/assignment_overrides?per_page=20').then(function(
        response,
    ) {
        console.log('data', response.data)
        console.log('status', response.status)
        console.log(response.statusText)
        console.log(response.headers)
        console.log(response.config)
    })

    /*
fetch(
    'http://fake.instructure.com/api/v1/courses/2/quizzes/assignment_overrides?per_page=20',
    {
        credentials: 'include',
        headers: {
            accept:
            'application/json, text/javascript, application/json+canvas-string-ids; q=0.01',
            'accept-language': 'en-US,en;q=0.9,es-419;q=0.8,es;q=0.7,eo;q=0.6',
            'cache-control': 'no-cache',
            pragma: 'no-cache',
            'x-csrf-token':
                'WllM2WM7t/Za26BkBArT217PxGGXTSbirmnRmIaS1KEvLnuBOnz7xgi2kgtmXry9JvaoKfMcUoXpJ4n7taXk7g==',
            'x-requested-with': 'XMLHttpRequest',
        },
        referrer: 'http://fake.instructure.com/courses/2/quizzes',
        referrerPolicy: 'no-referrer-when-downgrade',
        body: null,
        method: 'GET',
        mode: 'cors',
    },
)
    .then(response => {
        const myHeaders = response.headers
        for (var pair of myHeaders.entries()) {
            console.log(pair[0] + ': ' + pair[1])
        }
        console.log('link::', myHeaders.get('Link'))
        //console.log(response.headers);
        return response.json()
    })
    .then(json => console.log(json))
    */
})
