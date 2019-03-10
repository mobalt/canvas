/** Base url to canvas api
 * For example --> https://canvas.instructure.com/api/v1
 * @type {string}
 */
const api_url = `${document.location.origin}/api/v1`


// Add csrf token to all future AJAX requests
$.ajaxSetup({
    headers: {
        'X-CSRF-Token': tokenFromCookie(),
    }
});


/**
 * Searches for a regular expression pattern in a string.
 * @param {RegExp} pattern - The regular expression to search for. Must have at least 1 capture group
 * @param {string} input - The input string to will be matched against pattern.
 * @param {string} error_message - Will be displayed if no match is found
 * @returns {string} Result in capture group 1
 * @throws Error if no match
 */
function rxSearch(pattern, input, error_message) {
    const match = pattern.exec(input)
    if (match)
        return match[1]
    else
        throw Error(error_message)
}

/**
 * Get csrf token from cookie
 * @returns {string} csrf token
 */
function tokenFromCookie() {
    const token = rxSearch(
        /_csrf_token=(\S+)/,
        document.cookie,
        "Couldn't find csrf token in cookie. This is a fatal error."
    )
    return decodeURIComponent(token)
}
