function store(obj) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.set(obj, resolve)
    })
}

function extractToken(cookie) {
    const regex = /_csrf_token=(\S+)/
    const result = regex.exec(cookie)
    return result ? decodeURIComponent(result[1]) : ''
}

function setTokenFromCookie() {
    return new Promise((resolve, reject) => {
        chrome.tabs.executeScript({ code: 'document.cookie' }, cookie => {
            store({
                token: extractToken(cookie[0]),
                date: new Date(),
            }).then(resolve)
        })
    })
}

function processUrl(url) {
    const regex = /^(https?:\/\/[^\/]+\/)courses\/(?:(\d+)\/?(?:([a-z]+)\/?(\d+)?)?)/
    const [, base, course, type, item] = regex.exec(url) || []
    const api = base + 'api/v1/'

    return { base, api, course, type, item }
}

function onClickHandler(info, tab) {
    const [fn, type] = info.menuItemId.replace(' ', '_').split(':')
    const url = info.linkUrl || info.pageUrl
    const urlObj = processUrl(url)
    chrome.tabs.executeScript({
        code: `const baseUrl = "${urlObj.base}", apiUrl = "${urlObj.api}", course_id="${urlObj.course}", item_id="${urlObj.item}", item_type="${urlObj.type}"`,
    })
    Promise.all([setTokenFromCookie(), store(urlObj)]).then(function() {
        handlers[fn](urlObj, tab.id, tab)
    })
}

function matrix(dict, path = []) {
    let result = []
    for (const prop in dict) {
        const value = dict[prop]
        if (typeof value == 'object')
            result = result.concat(matrix(value, path.concat(prop)))
        else result.push(path.concat(prop, value))
    }
    return result
}

const T = {
    dict(matrix, keyCol = 0, valueCol) {
        if (valueCol == undefined) valueCol = keyCol + 1

        const result = {}
        for (const row of matrix) {
            result[row[keyCol]] = row[valueCol]
        }
        return result
    },

    slice(matrix, startCol, endCol) {
        return matrix.map(row => row.slice(startCol, endCol))
    },

    get(matrix, col) {
        return matrix.map(row => row[col])
    },

    eachRow(matrix, fn) {
        for (const row of matrix) {
            fn.apply(matrix, row)
        }
    },
}

chrome.contextMenus.onClicked.addListener(onClickHandler)

function loadFiles(...files) {
    for (const file of files) {
        chrome.tabs.executeScript({ file })
    }
}

function reloadPage() {
    chrome.tabs.reload()
}

const menu = matrix({
    '/users': {
        Student_List(url, tab) {
            loadFiles(
                'assets/axios.v0.19.0.min.js',
                'downloadCSV.js',
                'common.js',
                'exportStudents.js',
            )
        },
    },
    '/quizzes': {
        Import_Quiz(url, tab) {},
    },
    '/quizzes/*': {
        Export_Quiz(url, tab) {},
        Add_Questions(url, tab) {
            loadFiles(
                'assets/jquery.js',
                'assets/js-yaml.js',
                'quizzes.js',
                'quizPost.js',
            )
        },
        Moderate_quiz(url, tab) {
            loadFiles(
                'assets/axios.v0.19.0.min.js',
                'assets/jquery.js',
                'common.js',
                'moderate_quiz.js',
            )
        },
        Quiz_Overrides(url, tab) {
            loadFiles(
                'assets/axios.v0.19.0.min.js',
                'assets/jquery.js',
                'common.js',
                'quizAssign.js',
            )
        },
    },
})

const handlers = T.dict(menu, 1, 2)

// Set up context menu
chrome.runtime.onInstalled.addListener(function() {
    T.eachRow(menu, (url, id) => {
        const title = id.replace('_', ' ')
        const pattern = ['*://*/courses/*' + url]

        // Right-click anywhere on page
        chrome.contextMenus.create({
            id: id + ':page',
            title,
            documentUrlPatterns: pattern,
        })

        // Right-click on a link
        chrome.contextMenus.create({
            id: id + ':link',
            title,
            contexts: ['link'],
            targetUrlPatterns: pattern,
        })
    })
})
