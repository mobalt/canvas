function onClickHandler(info, tab) {
    console.log('item ' + info.menuItemId + ' was clicked')
    console.log('info: ' + JSON.stringify(info))
    console.log('tab: ' + JSON.stringify(tab))
    handlers[info.menuItemId](tab)
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

// Set up context menu
chrome.runtime.onInstalled.addListener(function() {
    menuItem('Student List ↯', '/users')
    menuItem('Import Quiz', '/quizzes')
    menuItem('Export Quiz ↯', '/quizzes/*')
    menuItem('Add Questions', '/quizzes/*')
    menuItem('Moderate Quiz', '/quizzes/*')
    menuItem('Quiz Overrides', '/quizzes/*')
})

const handlers = {}

function menuItem(text, urlPattern, onClick) {
    // ids are required string properties for menu items
    // but for our purposes, just generate a random name
    const id1 = Math.random().toString()
    const id2 = Math.random().toString()

    // provide default click handler
    if (!onClick)
        onClick = () => {
            alert(`Clicked on: ${text}`)
        }

    // associate random Id to click handler
    handlers[id1] = onClick
    handlers[id2] = onClick

    // Right-click anywhere on page
    chrome.contextMenus.create({
        id: id1,
        title: text,
        contexts: ['page'],
        documentUrlPatterns: [`*://*/courses/*${urlPattern}`],
    })

    // Right-click on links
    chrome.contextMenus.create({
        id: id2,
        title: text,
        contexts: ['link'],
        targetUrlPatterns: [`*://*/courses/*${urlPattern}`],
    })
}
