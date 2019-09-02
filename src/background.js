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

    chrome.contextMenus.create({
        id: 'Export_Responses',
        title: 'Export Responses (.yml)',
        documentUrlPatterns: ['*://*/courses/*/quizzes/*'],
    })
})

chrome.contextMenus.onClicked.addListener(onClickHandler)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.contentScriptQuery == 'queryPrice') {
        // var url= "http://fake.instructure.com/files/21/download?download_frd=1&verifier=1HRAMtYFWcZNzY6LoarEyB7Q6aiu8QVBcfXpNkup"
        var url =
            'https://wustl.beta.instructure.com/files/603882/download?download_frd=1&verifier=BMwhwDzaDSDcCHUb27fiRo2xYaQ0TmwE4raucDwe'
        // var url = "https://another-site.com/price-query?itemId=" +
        // 	encodeURIComponent(request.itemId);
        fetch(url)
            .then(response => {
                // console.log(response)
                // console.log('>>>>',arguments)
                let stringPromise = response.text()
                console.log('Output:')
                console.log(stringPromise)
                return stringPromise
            })
            // .then(text => parsePrice(text))
            .then(price => sendResponse(price))
        return true // Will respond asynchronously.
    } else if (request.getFile) {
        const { headers, url } = request.getFile

        fetch(url, {
            // credentials: "include",
            // headers,
            referrer: url,
            method: 'GET',
            mode: 'cors',
            headers: {
                ...headers,

                'Content-Type': 'text/plain',
                Accept: 'text/plain',
            },
            // mode: 'no-cors'
        })
            .then(response => {
                // console.log(response)
                // console.log('>>>>',arguments)
                let stringPromise = response.text()
                console.log('Output:')
                console.log(stringPromise)
                return stringPromise
            })
            // .then(text => parsePrice(text))
            .then(text => sendResponse(text))
    }
})
