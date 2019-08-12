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
        code: `var baseUrl = "${urlObj.base}", apiUrl = "${urlObj.api}", course_id="${urlObj.course}", item_id="${urlObj.item}", item_type="${urlObj.type}", original_url="${url}", exec_fn = "${fn}";`,
    })
    chrome.tabs.executeScript({ file: 'content.js' })
    // handlers[fn](urlObj, tab.id, tab)
}

// Set up context menu

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: 'Student_List',
        title: 'Student List (.csv)',
        documentUrlPatterns: ['*://*/courses/*'],
    })

    chrome.contextMenus.create({
        id: 'Import_Quiz',
        title: 'Import a Quiz',
        documentUrlPatterns: ['*://*/courses/*/quizzes'],
    })

    chrome.contextMenus.create({
        id: 'Quiz_Overrides',
        title: 'Quiz Overrides',
        documentUrlPatterns: ['*://*/courses/*/quizzes/*'],
    })

    chrome.contextMenus.create({
        id: 'Moderate_Quiz',
        title: 'Moderate quiz',
        documentUrlPatterns: ['*://*/courses/*/quizzes/*'],
    })

    chrome.contextMenus.create({
        id: 'Export_Quiz',
        title: 'Export quiz (.yml)',
        documentUrlPatterns: ['*://*/courses/*/quizzes/*'],
    })
})

chrome.contextMenus.onClicked.addListener(onClickHandler)
