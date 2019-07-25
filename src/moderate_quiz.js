const newForm = `
    <h1>Bulk Quiz Extensions</h1>
    <div>
        <p>Enter list of student canvas-ids below:</p>
        <textarea id="student_list">
        1301
        1051
        </textarea>
        <table>
            <tr>
                <td> Extra Attempts:</td>
                <td>
                    <input
                            id="extra_attempts"
                            type="text"
                            name="extra_attempts"
                            title="additional extra attempts"
                    >
                </td>
            </tr>
            <tr>
                <td>
                    Extra time <b>(in minutes)</b> on every attempt:
                </td>
                <td>
                    <input
                            id="extra_time"
                            type="text"
                            name="extra_time"
                            title="additional minutes on each attempt"
                            value="15"
                    >
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <input type="checkbox" name="manually_unlocked" id="manually_unlocked" value="1">
                        Manually unlock the quiz for the next attempt
                </td>
            </tr>
            <tr>
                <td colspan="2" style="text-align: center">
                    <button id="mod_update" class="btn btn-primary save_button">
                        Submit Quiz Extensions for <b>5</b> Students
                    </button>
                </td>
            </tr>
        </table>

        <div id="display_results"></div>
        <style>
        #student_list {
            width: 500px;
            min-height: 150px;
        }
        #display_results span{
            border: #CCC solid 1px;
            padding: 2px 4px;
            margin: 3px;
            border-radius: 8px;
            background-color: #EEE;
        }
        #display_results span.success {
            border-color: #060;
            background-color: #5a4;
            font-weight: bold;
            color: #FFF;
        }
        #display_results span.failed {
            border-color: #600;
            background-color: #c30;
            font-weight: bold;
            color: #FFF;
        }
    </style>
    </div>
`

function getExtensionUrl() {
    const currentURL = document.location.href
    return currentURL.substring(0, currentURL.length - 8) + 'extensions/'
}

function getToken() {
    return $('#moderate_student_form > input[name="authenticity_token"]').val()
}

const postPayload = {
    utf8: '✓',
    authenticity_token: getToken(),
    _method: 'POST',
}
const extensionURL = getExtensionUrl()

// const h1 = document.getElementsByTagName('H1')[0]
// h1.textContent = 'ONe Two'
// 'https://wustl.instructure.com/api/v1/courses/6225/users.json?per_page=100&enrollment_role_id=3&page=6'
// $('h1').html(getExtensionUrl() + 'Test')

$('h1')
    .append('<button>Bulk</button>')
    .click(function() {
        $('#content').html(newForm)

        $('#student_list').change(cleanInput)

        $('#mod_update').click(function() {
            $(this).attr('disabled', 'disabled')
            cleanInput()
            postPayload['extra_attempts'] = +$('#extra_attempts').val()
            postPayload['extra_time'] = +$('#extra_time').val()
            postPayload['manually_unlocked'] = +$('#manually_unlocked').prop(
                'checked',
            )

            submitExtensions()
        })
    })

let submittedAlready = false

function submitExtensions() {
    if (submittedAlready) return false
    submittedAlready = true

    const students = $('#student_list')
        .val()
        .split(' ')
    const results = $('#display_results')
    let qty = 0
    students.forEach(function(studentID, index, array) {
        qty++
        results.append(`<span value="${studentID}">${studentID}</span>`)
        $.post(extensionURL + studentID, postPayload)
            .done(function(data) {
                results.find(`[value="${studentID}"]`).addClass('success')
            })
            .fail(function(data) {
                results.find(`[value="${studentID}"]`).addClass('failed')
            })
            .always(function() {
                qty--
            })
    })
}

function cleanInput() {
    const textarea = $('#student_list')
    const cleanValue = textarea
        .val()
        .replace(/\D+/g, ' ')
        .trim()
    textarea.val(cleanValue)
    $('#mod_update').html(
        'Submit Quiz Extensions for <b>' +
            cleanValue.split(' ').length +
            '</b> Students',
    )
}
