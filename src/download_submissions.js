import r from './common'
import { today } from './helpers'
import { downloadCsv } from './download'

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function submitGrade() {
    const sub = {
        quiz_submissions: [
            {
                attempt: 1,
                questions: {
                    13: {
                        score: 2.5,
                        comment:
                            "This can't be right, but I'll let it pass this one time.",
                    },
                    14: {
                        score: 0,
                        comment: 'Good thinking. Almost!',
                    },
                },
            },
        ],
    }
    const course_id = 1,
        quiz_id = 3,
        id = 16

    r.put(
        `courses/${course_id}/quizzes/${quiz_id}/submissions/${id}`,
        sub,
    ).then(function() {
        console.log(arguments)
    })
}

// submitGrade()

function dlwnd() {
    // https://cdn.inst-fs-iad-beta.inscloudgate.net/355ec73c-93a0-48cd-b4d5-5a53e9f2e435/Quiz%201%20-%20Ch%202%20Quiz%20Student%20Analysis%20Report.csv?token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImNkbiJ9.eyJyZXNvdXJjZSI6Ii8zNTVlYzczYy05M2EwLTQ4Y2QtYjRkNS01YTUzZTlmMmU0MzUvUXVpeiUyMDElMjAtJTIwQ2glMjAyJTIwUXVpeiUyMFN0dWRlbnQlMjBBbmFseXNpcyUyMFJlcG9ydC5jc3YiLCJ1c2VyX2lkIjoiNjA3ODAwMDAwMDAwMDM5MzkiLCJpYXQiOjE1NjY3MDUzMDcsImV4cCI6MTU2Njc5MTcwN30.NtLk1_TELhiaKbYlczt97PJESMObXaqi-oliLhHFXf7lhTPs2yzjMrRZT0ZmSMZ6AscxklCnBhdIlkWUhPZMOA&download=1&content_type=text%2Fcsv
    chrome.runtime.sendMessage(
        { contentScriptQuery: 'queryPrice', itemId: 12345 },
        price => {
            console.log('return value:')
            console.log(price)
            console.log(arguments)
        },
    )
}

// dlwnd()

function tryFirst() {
    var url =
        'https://wustl.beta.instructure.com/files/603882/download?download_frd=1&verifier=BMwhwDzaDSDcCHUb27fiRo2xYaQ0TmwE4raucDwe'
    r.get(url)
        .then(response => {
            console.log('Worked on first', response)
        })
        .catch(({ request, headers: hd, config: { headers, url } }) => {
            const invocation = new XMLHttpRequest()

            invocation.open('GET', url, true)
            invocation.withCredentials = true
            invocation.onload = function() {
                console.log(invocation.responseURL) // http://example.com/test
                console.log('invocation change', invocation)
            }
            invocation.onreadystatechange = function() {
                console.log(invocation.responseURL) // http://example.com/test
                console.log('invocation change', invocation)
            }
            invocation.send()

            fetch(url, {
                method: 'GET',
            })
                .then(response => {
                    console.log('redirected to', response.url)
                    console.log('plain', response)
                })
                .catch(response => {
                    console.log('badredirected to', response.url)
                    console.log('badplain', response)
                })
            console.log('headers:::', hd)
            console.log('request:::', request)
            console.log('Sending it to background.js', headers, url)
            chrome.runtime.sendMessage(
                { getFile: { headers, url } },
                response => {
                    console.log(response)
                },
            )
        })
}
tryFirst()

function getLive() {
    var url =
        'https://wustl.beta.instructure.com/files/603882/download?download_frd=1&verifier=BMwhwDzaDSDcCHUb27fiRo2xYaQ0TmwE4raucDwe'
    // var url = "https://another-site.com/price-query?itemId=" +
    // 	encodeURIComponent(request.itemId);
    console.log(r.defaults.headers)
    console.log(r.defaults)

    r.get(url, {})
        .then(function() {
            console.log('then')
            console.log(arguments)
        })
        .catch(function({ config }) {
            const { headers, url } = config
            console.log('catch')
            console.log(headers, url)

            fetch(url, {
                credentials: 'include',
                headers,
                referrer: url,
                method: 'GET',
            })
                .then(function(response) {
                    console.log('THENNN:', response.url, response)
                })
                .catch(function(response) {
                    console.log('CATCHHHH:', response.url, response)
                })
        })
    // fetch(url)
    // 	.then(response => {
    // 		console.log(response)
    // 		console.log('>>>>',arguments)
    // 		let stringPromise = response.text()
    // 		console.log('Output:')
    // 		console.log(stringPromise)
    // 		return stringPromise
    // 	})
}

// getLive()

function download_file(url) {
    return $.get(url)
    return r.get(url).then(response => {
        window.resp = response
        console.log(response)
        return response.data
    })
}

function check_report(url) {
    return r.get(url).then(({ data }) => {
        if (data.file && data.file.url) {
            //awesome, download it
            return download_file(data.file.url)
        } else {
            // try again in one second
            return delay(1000).then(() => check_report(url))
        }
    })
}

function request_report(course_id, item_id) {
    const url = `courses/${course_id}/quizzes/${item_id}/reports`
    const request_body = {
        quiz_reports: [
            { report_type: 'student_analysis', includes_all_versions: true },
        ],
        include: ['progress', 'file'],
    }
    return r
        .post(url, request_body, {
            headers: { accept: 'application/vnd.api+json' },
        })
        .then(({ data }) => {
            const last_item = data.quiz_reports.pop()
            if (last_item) {
                return delay(100).then(() => check_report(last_item.url))
            } else {
                return Promise.reject(
                    'No reports made. Do you have the correct permission?',
                )
            }
        })
}

//const a = request_report(course_id, item_id)
//console.log(a)

/*
	var response = {
		quiz_reports: [{
			id: "5",
			report_type: "student_analysis",
			readable_type: "Student Analysis",
			includes_all_versions: true,
			includes_sis_ids: true,
			generatable: true,
			anonymous: false,
			url: "http://fake.instructure.com/api/v1/courses/1/quizzes/3/reports/5",
			created_at: "2019-08-24T22:59:44Z",
			updated_at: "2019-08-24T22:59:44Z",
			links: {quiz: "http://fake.instructure.com/api/v1/courses/1/quizzes/3"},
			progress: {
				id: 3,
				context_id: 5,
				context_type: "Quizzes::QuizStatistics",
				user_id: null,
				tag: "Quizzes::QuizStatistics",
				completion: 0.0,
				workflow_state: "queued",
				created_at: "2019-08-24T23:01:06Z",
				updated_at: "2019-08-24T23:01:06Z",
				message: null,
				url: "http://fake.instructure.com/api/v1/progress/3"
			}
		}]
	}

	var good_response = {
		"id": 5,
		"report_type": "student_analysis",
		"readable_type": "Student Analysis",
		"includes_all_versions": true,
		"includes_sis_ids": true,
		"generatable": true,
		"anonymous": false,
		"url": "http://fake.instructure.com/api/v1/courses/1/quizzes/3/reports/5",
		"progress_url": "http://fake.instructure.com/api/v1/progress/3",
		"created_at": "2019-08-24T22:59:44Z",
		"updated_at": "2019-08-24T23:01:08Z",
		"file": {
			"id": 18,
			"uuid": "1ylX0xu09VOMSplSo1XHUx8tZ757qz3dugCYMkI1",
			"folder_id": null,
			"display_name": "All or Nothing Quiz Student Analysis Report.csv",
			"filename": "quiz_student_analysis_report.csv",
			"workflow_state": "processed",
			"upload_status": "success",
			"content-type": "unknown/unknown",
			"url": "http://fake.instructure.com/files/18/download?download_frd=1\u0026verifier=1ylX0xu09VOMSplSo1XHUx8tZ757qz3dugCYMkI1",
			"size": 451,
			"created_at": "2019-08-24T23:01:08Z",
			"updated_at": "2019-08-24T23:01:08Z",
			"unlock_at": null,
			"locked": false,
			"hidden": false,
			"lock_at": null,
			"hidden_for_user": false,
			"thumbnail_url": null,
			"modified_at": "2019-08-24T23:01:08Z",
			"mime_class": "file",
			"media_entry_id": null,
			"locked_for_user": false
		},
		"quiz_id": 3
	}

}

//get
const progress_url = `progress/${progress_id}`
//complete
var response = {
	id: 3,
	context_id: 5,
	context_type: "Quizzes::QuizStatistics",
	user_id: null,
	tag: "Quizzes::QuizStatistics",
	completion: 100.0,
	workflow_state: "completed",
	created_at: "2019-08-24T23:01:06Z",
	updated_at: "2019-08-24T23:01:08Z",
	message: null,
	url: "http://fake.instructure.com/api/v1/progress/3"
}


const get_file_url = `courses/1/quizzes/3/reports/5?include%5B%5D=progress&include%5B%5D=file`
var response = {
	quiz_reports: [{
		id: "5",
		report_type: "student_analysis",
		readable_type: "Student Analysis",
		includes_all_versions: true,
		includes_sis_ids: true,
		generatable: true,
		anonymous: false,
		url: "http://fake.instructure.com/api/v1/courses/1/quizzes/3/reports/5",
		created_at: "2019-08-24T22:59:44Z",
		updated_at: "2019-08-24T23:01:08Z",
		links: {quiz: "http://fake.instructure.com/api/v1/courses/1/quizzes/3"},
		progress: {
			id: 3,
			context_id: 5,
			context_type: "Quizzes::QuizStatistics",
			user_id: null,
			tag: "Quizzes::QuizStatistics",
			completion: 100.0,
			workflow_state: "completed",
			created_at: "2019-08-24T23:01:06Z",
			updated_at: "2019-08-24T23:01:08Z",
			message: null,
			url: "http://fake.instructure.com/api/v1/progress/3"
		},
		file: {
			id: 18,
			uuid: "1ylX0xu09VOMSplSo1XHUx8tZ757qz3dugCYMkI1",
			folder_id: null,
			display_name: "All or Nothing Quiz Student Analysis Report.csv",
			filename: "quiz_student_analysis_report.csv",
			workflow_state: "processed",
			upload_status: "success",
			"content-type": "unknown/unknown",
			url: "http://fake.instructure.com/files/18/download?download_frd=1\u0026verifier=1ylX0xu09VOMSplSo1XHUx8tZ757qz3dugCYMkI1",
			size: 451,
			created_at: "2019-08-24T23:01:08Z",
			updated_at: "2019-08-24T23:01:08Z",
			unlock_at: null,
			locked: false,
			hidden: false,
			lock_at: null,
			hidden_for_user: false,
			thumbnail_url: null,
			modified_at: "2019-08-24T23:01:08Z",
			mime_class: "file",
			media_entry_id: null,
			locked_for_user: false
		}
	}]
}

// get response.quiz_reports[0].file.url


r.get(`courses/${course_id}/users?per_page=100&enrollment_role_id=3`).then(
	response => {
		// console.log('Final response', response)

		// first row is header names
		const csvResults = [['canvas_id', 'sis_id', 'name']].concat(
			response.data.map(
				({id, sis_user_id: sis, sortable_name: name}) => [
					id,
					sis,
					name,
				],
			),
		)

		downloadCsv(filename, csvResults)
	},
)

 */

// fetch("http://fake.instructure.com/api/v1/courses/1/quizzes/1/reports", {
// 	"credentials": "include",
// 	"headers": {
// 		"accept": "application/vnd.api+json",
// 		"accept-language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7,eo;q=0.6",
// 		"cache-control": "no-cache",
// 		"content-type": "application/json",
// 		"pragma": "no-cache",
// 		"x-csrf-token": "U/s1la8Rai5Qa9++J/aq5zT4ZVOg5NlOBRfu1BEkdrI1sE3jmUUoTDNcuYl9gcKVWtcUMNLS7ntXWa3gJGcO/w==",
// 		"x-requested-with": "XMLHttpRequest"
// 	},
// 	"referrer": "http://fake.instructure.com/courses/1/quizzes/1/statistics",
// 	"referrerPolicy": "no-referrer-when-downgrade",
// 	"body": "{\"quiz_reports\":[{\"report_type\":\"student_analysis\",\"includes_all_versions\":true}],\"include\":[\"progress\",\"file\"]}",
// 	"method": "POST",
// 	"mode": "cors"
// })
// fetch("http://fake.instructure.com/api/v1/courses/1/quizzes/3/reports", {
// 	"credentials": "include",
// 	"headers": {
// 		"accept": "application/vnd.api+json",
// 		"accept-language": "en-US,en;q=0.9,es-419;q=0.8,es;q=0.7,eo;q=0.6",
// 		"cache-control": "no-cache",
// 		"content-type": "application/json;charset=UTF-8",
// 		"pragma": "no-cache",
// 		"x-csrf-token": "uMdCmStIFDW34XRLyDAQexrGh4xsD7Au1W8iUX7qUJrejDrvHRxWV9TWEnySR3gJdOn27x45hxuHIWFlS6ko1w==",
// 		"x-requested-with": "XMLHttpRequest"
// 	},
// 	"referrer": "http://fake.instructure.com/courses/1/quizzes/3",
// 	"referrerPolicy": "no-referrer-when-downgrade",
// 	"body": "{\"quiz_reports\":[{\"report_type\":\"student_analysis\",\"includes_all_versions\":true}],\"include\":[\"progress\",\"file\"]}",
// 	"method": "POST",
// 	"mode": "cors"
// })
