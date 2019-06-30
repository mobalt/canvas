function onClickHandler(info, tab) {
    console.log('item ' + info.menuItemId + ' was clicked')
    console.log('info: ' + JSON.stringify(info))
    console.log('tab: ' + JSON.stringify(tab))
}

chrome.contextMenus.onClicked.addListener(onClickHandler)

// Set up context menu
chrome.runtime.onInstalled.addListener(function() {
    function linkMenuItem(urlPattern) {
        return { targetUrlPatterns: urlPattern, contexts: ['link'] }
    }
    function pageMenuItem(urlPattern) {
        return { documentUrlPatterns: urlPattern, contexts: ['page'] }
    }
    function menuItem(id, text, urlPattern, parentId) {
        return {
            id,
            title: text,
            documentUrlPatterns: [`*://*/courses/*${urlPattern}`],
            contexts: ['page'],
            parentId,
        }
    }

    const items = [
        menuItem('students', 'Students', ''),
        menuItem('studentsList', 'Download List', '', 'students'),
        menuItem('quiz', 'Quiz', '/quizzes/*'),
        menuItem('quizImport', 'Import Questions', '/quizzes/*', 'quiz'),
        menuItem('quizExport', 'Export Questions', '/quizzes/*', 'quiz'),
        { id: 'quizSeparator1', type: 'separator', parentId: 'quiz' },
        menuItem('quizModerate', 'Moderate', '/quizzes/*', 'quiz'),
        menuItem('quizOverrides', 'Overrides', '/quizzes/*', 'quiz'),
    ]
    for (const i of items) {
        chrome.contextMenus.create(i)
    }
})
