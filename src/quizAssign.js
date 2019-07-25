const override_form = `
<h1>Override List for specific Assignment</h1>
<div>
<p>Paste list of student canvas_id's:</p>
<textarea id="student_list">
</textarea>
<button id="overlay_submit_btn" class="btn btn-primary save_button">
    Submit Override
</button>
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
        color: #FFF
    }
    #display_results span.failed {
        border-color: #600;
        background-color: #c30;
        font-weight: bold;
        color: #FFF
    }
</style>
</div>
`

$('body').html(override_form)
$('#overlay_submit_btn').click(function() {
    const student_ids = $('#student_list')
        .val()
        .replace(/\D+/g, ' ')
        .trim()
        .split(' ')
    const title = `${student_ids.length} student(s)`

    r.get(`courses/${course_id}/quizzes/${item_id}`)
        .then(response => {
            const { assignment_id } = response.data
            return r.post(
                `courses/${course_id}/assignments/${assignment_id}/overrides`,
                {
                    assignment_override: {
                        student_ids,
                        title,
                    },
                },
            )
        })
        .then(response => {
            $('#display_results').html(
                '<span class="success">Success.</span> Reloading this page in 5 seconds.',
            )
            setTimeout(function() {
                window.location.reload(1)
            }, 3000)
        })
        .catch(function(error) {
            let errorMsg = '<span class="failed">Error: </span> '

            if (error.response && error.response.data.errors) {
                errorMsg += JSON.stringify(error.response.data.errors)
            } else {
                errorMsg += error
            }
            $('#display_results').html(errorMsg)
        })
})
