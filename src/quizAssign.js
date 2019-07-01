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

const show_override_btn = $(
    '<a class="btn btn-secondary">Add Override List</a>',
)
$('.preview_quiz_button').append(show_override_btn)
show_override_btn.click(function() {
    const assignmentLookup = Quiz.thisOne().getAssignment()
    $('#quiz_show > header').after(override_form)
    $('#overlay_submit_btn').click(function() {
        // prevent accidental double-submission
        $(this).attr('disabled', 'disabled')

        const students = $('#student_list')
            .val()
            .replace(/\D+/g, ' ')
            .trim()
            .split(' ')

        assignmentLookup.then(assignment => {
            assignment.addOverride(students)
        })
    })
})
