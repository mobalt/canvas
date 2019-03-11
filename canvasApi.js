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


/**
 * Get current course id from current URL
 * @returns {string}
 */
function currentCourseId() {
    return rxSearch(
        /^\/courses\/(\d+)/i,
        document.location.pathname,
        "Couldn't find course id in current path. Are you on a canvas course page?"
    )
}


async function jsonList(url, data = {per_page: 100, page: 1}, converterFn = null) {
    if (!data.page) data.page = 1
    if (!data.per_page) data.per_page = 100

    let rows = []
    let response
    while ((response = await $.getJSON(url, data)) && response.length != 0) {
        rows = rows.concat(response)
        data.page++
    }

    // convert to Custom classes if converter is provided
    // otherwise just return raw array
    if (converterFn) {
        rows = rows.map(converterFn)
    }
    return rows
}

async function postItem(url, data, converterFn = null) {
    const result = await $.ajax({
        url,
        data: JSON.stringify(data),
        type: 'POST',
        contentType: 'application/json',
    })

    if (converterFn)
        return converterFn(result)
    else
        return result
}


class Course {
    constructor(course_id) {
        this.course_id = course_id
    }

    getGroups() {
        return jsonList(
            `${api_url}/courses/${this.course_id}/groups`,
            undefined,
            Group.fromJson
        )
    }

    getCategories() {
        return jsonList(
            `${api_url}/courses/${this.course_id}/group_categories`,
            undefined,
            Category.fromJson
        )
    }

    getUsers(filters) {
        return jsonList(
            `${api_url}/courses/${this.course_id}/users`,
            filters,
            User.fromJson
        )

    }

    getStudents() {
        // limit results to students only
        return this.getUsers({enrollment_role_id: 3})
    }

    createCategory(category_name) {
        return postItem(
            `${api_url}/courses/${this.course_id}/group_categories`,
            {name: category_name},
            Category.fromJson
        )
    }

    /**
     * Add extensions for a specific quiz
     * @example
     * Course.thisOne().addQuizExtension(4113, [
     *              {user_id: 15656, extra_attempts: 2},
     *              {user_id: 18279, extra_time: 75},
     *          ])
     * @param quiz_id
     * @param {[]} extensionList
     * @return {Promise<*|*>}
     */
    addQuizExtension(quiz_id, extensionList) {
        return postItem(
            `${api_url}/courses/${currentCourseId()}/quizzes/${quiz_id}/extensions`,
            {quiz_extensions: extensionList}
        )
    }

    /**
     * The current course that the user is viewing on browser.
     * @returns {Course}
     */
    static thisOne() {
        return new Course(currentCourseId())
    }
}


class Assignment {
    constructor(assignment_id) {
        this.assignment_id = assignment_id
    }

    addExtension(options, students) {

    }
}


class Category {
    constructor(category_id, name = '') {
        this.category_id = category_id
        this.name = name
    }

    createGroup(group_name) {
        return postItem(
            `${api_url}/group_categories/${this.category_id}/groups`,
            {name: group_name},
            Group.fromJson
        )
    }

    static fromJson(categoryObj) {
        return new Category(categoryObj.id, categoryObj.name)
    }
}


class Group {
    constructor(group_id, name = '') {
        this.group_id = group_id
        this.name = name
    }

    addMember(user_id) {
        console.log(`Adding member ${user_id} to group ${this.group_id}`)
        return postItem(
            `${api_url}/groups/${this.group_id}/memberships`,
            {user_id},
            user => new User(user.user_id)
        )
    }

    addManyMembers(list_of_user_ids) {
        return Promise.all(list_of_user_ids.map(this.addMember.bind(this)))
    }

    static fromJson(groupObj) {
        return new Group(groupObj.id, groupObj.name)
    }

}


class User {
    constructor(user_id, name = '', extra = '') {
        this.user_id = user_id
        this.name = name
        this.extra = extra
    }

    static fromJson(userObj) {
        return new User(userObj.id, userObj.sortable_name, userObj.sis_user_id)
    }

}

