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

$('body').html(newForm)

if (item_type != 'quizzes') {
    throw new Error('Not a quiz')
}
const quiz_id = item_id

$('#student_list').change(cleanInput)

$('#mod_update').click(function() {
    cleanInput()

    $(this).attr('disabled', 'disabled')
    const extra_attempts = +$('#extra_attempts').val(),
        extra_time = +$('#extra_time').val(),
        manually_unlocked = +$('#manually_unlocked').prop('checked')
    const students = $('#student_list')
        .val()
        .split(' ')

    const quiz_extensions = students.map(user_id => ({
        user_id,
        extra_time,
        extra_attempts,
        manually_unlocked,
    }))

    r.post(`courses/${course_id}/quizzes/${quiz_id}/extensions`, {
        quiz_extensions,
    })
        .then(response => {
            $('#display_results').html(
                '<span class="success">Success.</span> Press F5 to reload the page.',
            )
            console.log(response)
        })
        .catch(function(error) {
            $('#display_results').html(
                `<span class="failed">Error: </span> ${error}.`,
            )
            console.log(error)
        })
})

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
