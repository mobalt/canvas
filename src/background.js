function onClickHandler(info, tab) {
    console.log('item ' + info.menuItemId + ' was clicked')
    console.log('info: ' + JSON.stringify(info))
    console.log('tab: ' + JSON.stringify(tab))
    const [fn, type] = info.menuItemId.replace(' ', '_').split(':')
    const url = info.linkUrl || info.pageUrl
    handlers[fn](url, tab)
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

const menuTree = {
    '/users': {
        'Student_List ': (url, tab) => {
            alert('test')
        },
    },
    '/quizzes': {
        Import_Quiz(url, tab) {},
    },
    '/quizzes/*': {
        Export_Quiz(url, tab) {},
        Add_Questions(url, tab) {},
        Moderate_quiz(url, tab) {},
        Quiz_Overrides(url, tab) {},
    },
}

// Set up context menu
chrome.runtime.onInstalled.addListener(function() {
    for (const urlPattern in menuTree) {
        for (const fnName in menuTree[urlPattern]) {
            const fn = menuTree[urlPattern][fnName]
            handlers[fnName] = fn
            const title = fnName.replace('_', ' ')

            // Right-click anywhere on page
            chrome.contextMenus.create({
                id: `${fnName}:page`,
                title,
                contexts: ['page'],
                documentUrlPatterns: [`*://*/courses/*${urlPattern}`],
            })

            // Right-click on links
            chrome.contextMenus.create({
                id: `${fnName}:link`,
                title,
                contexts: ['link'],
                targetUrlPatterns: [`*://*/courses/*${urlPattern}`],
            })
        }
    }
})

const handlers = {}
