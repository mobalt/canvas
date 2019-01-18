const typeMap = {
    'text': TextOnly,
    'essay': Essay,
    'fileupload': FileUpload,
    'multiplechoice': MultipleChoice,
    'multipleanswer': MultipleAnswer,
    'multipleanswers': MultipleAnswer,
    'fillinblank': FillInBlank,
    'singleblank': FillInBlank,
    'multipleblanks': MultipleBlanks,
    'multipledropdowns': MultipleDropDowns,
    'truefalse': TrueFalse,
    'matching': Matching,
}

function resolve (item) {
    let {type, name, text, points, answers, answer, pick, questions} = item
    
    if (!points)
        points = 1
    
    let result
    
    if (type === 'group') {
        result = new Group(name, points, pick)
        // loop over all nested questions
        result.questions = questions.map(resolve)
    } else {
        
        if (!type) {
            // todo: error since that's important to all questions
        }
        type = type.toLowerCase().replace(/[^a-z]+/g, '')
        type = typeMap[type]
        if (!type) {
            // todo: error type is misspelled
        }
        if (!text) {
            // todo: error since that's important to all questions
        }
        if (!points)
            points = 1
        if (!name)
            name = 'Question'
        if (answer)
            answers = answer
        result = new type(text, name, points, answers)
    }
    return result
}

function getGroupsURL () {
    const currentURL = document.location.href
    return currentURL.replace(/[^\/]+$/, 'groups')
    
}

function getQuestionsURL () {
    const currentURL = document.location.href
    return currentURL.replace(/[^\/]+$/, 'questions')
}

function getPreviewURL(){
    const currentURL = document.location.href
    return currentURL.replace(/[^\/]+$/, 'take?preview=1')
    
}

function getToken () {
    return $('#quiz_options_form > input[name="authenticity_token"]').val()
}

const newForm = `
<h1>Bulk Quiz Import</h1>
<div>
    <p>Paste quiz in YAML format:</p>
<textarea id="student_list">- type: Text
  text: |-
    <table dir="ltr" align="left" width="276" cellspacing="0" cellpadding="5">
    <tbody>
    <tr valign="top">
    <td width="138"> <p align="center"><span style="color: #000000;"><strong>Variable</strong></span></p> </td>
    <td width="56"> <p align="center"><span style="color: #000000;"><strong>Beta</strong></span></p> </td>
    <td width="49"> <p align="center"><span style="color: #000000;"><i><strong>p</strong></i></span></p> </td>
    </tr>
    <tr valign="top">
    <td width="138"> <p><span style="color: #000000;">Income</span></p> </td>
    <td width="56"> <p align="center"><span style="color: #000000;">.33</span></p> </td>
    <td width="49"> <p align="center"><span style="color: #000000;">.03</span></p> </td>
    </tr>
    <tr valign="top">
    <td width="138"> <p><span style="color: #000000;">Number of arguments</span></p> </td>
    <td width="56"> <p align="center"><span style="color: #000000;">&ndash;.48</span></p> </td>
    <td width="49"> <p align="center"><span style="color: #000000;">.01</span></p> </td>
    </tr>
    <tr valign="top">
    <td width="138"> <p><span style="color: #000000;">Life satisfaction</span></p> </td>
    <td width="56"> <p align="center"><span style="color: #000000;">.13</span></p> </td>
    <td width="49"> <p align="center"><span style="color: #000000;">.81</span></p> </td>
    </tr>
    </tbody>
    </table>
    <p>Look at the table above for these 3 next questions.</p>
- type: Multiple Choice
  points: 1
  text: "<p> Multiple Choice Text </p>"
  answers:
    - <Correct One
    - Wrong 1
    - Wrong 2
- type: Multiple Answers
  text: <p> Two or more? (select all that apply)</p>
  answers:
    - Wrong 1
    - < Right 1
    - Wrong 2
    - <Right 2
    - Wrong 3
- type: Fill-in-blank
  text: |
    Name one group of people that receives special protections when participating in research:
  answers:
    - Children
    - Prisoners
    - Mentally handicapped
- type: Multiple Blanks
  text: <p>Roses are [color1], violets are [color2]</p>
  answers:
    color1:
      - red
      - pink
      - white
    color2:
      - blue
      - multi colored
      - violet
- type: Multiple Dropdowns
  text: Roses = [c1], Violets = [c2]
  answers:
    c1:
      - <correct 1
      - Wrong 1
      - wrong 2
    c2:
      - < Correct
      - Nope
      - nada

- type: Essay
  name: EssayQName
  points: 9
  text: Essay prompt.
- type: True-false
  text: is true?
  answer: false
- type: File Upload
  text: <p> Please upload file </p>
</textarea>
    <button id="mod_update" class="btn btn-primary save_button">
        Submit Quiz
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

const postPayload = {
    utf8: '✓',
    authenticity_token: getToken(),
    _method: 'POST',
}
const extensionURL = getGroupsURL()
const qURL = getQuestionsURL()

const btn = $('<li><a>YAML import</a></li>')
$('#quiz_tabs_tab_list').append(btn)
btn.click(function () {
    $('#questions_tab').html(newForm)
    
    // $('#student_list').change(cleanInput)
    
    $('#mod_update').click(function () {
        $(this).attr('disabled', 'disabled')
        // cleanInput()
    
        const val = $('#student_list').val()
        let quiz = jsyaml.load(val)
        quiz = quiz.map(resolve)
        //todo: create groups, update questions with groups
        let qty = 0
        quiz.forEach(question => {
            qty ++
            let payload = {
                ...postPayload,
                question,
            }
            $.post(qURL, payload)
                .fail(function (data) {
                    let h = $('#display_results').html()
                    h += question + '\n' + data + '\n'
                    $('#display_results').html(h)
                })
                .always(function () {
                    qty--
                    if (!qty){
                        let h = $('#display_results').html()
                        h = `DONE!<br> <a href="${getPreviewURL()}">View Preview</a><br>check if errors below: \n` + h
                        $('#display_results').html(h)
                    }
                })
        })
        
        //todo: submit questions
        // postPayload['extra_attempts'] = +$('#extra_attempts').val()
        
        // submitExtensions()
        
    })
})

let submittedAlready = false

function submitExtensions () {
    if (submittedAlready)
        return false
    submittedAlready = true
    
    const students = $('#student_list').val().split(' ')
    const results = $('#display_results')
    let qty = 0
    students.forEach(function (studentID, index, array) {
        qty++
        results.append(`<span value="${studentID}">${studentID}</span>`)
        $.post(extensionURL + studentID, postPayload)
         .done(function (data) {
             results.find(`[value="${studentID}"]`).addClass('success')
         })
         .fail(function (data) {
             results.find(`[value="${studentID}"]`).addClass('failed')
         })
         .always(function () {
             qty--
         })
    })
}

function cleanInput () {
    const textarea = $('#student_list')
    const cleanValue = textarea.val().replace(/\D+/g, ' ').trim()
    textarea.val(cleanValue)
    $('#mod_update')
        .html('Submit Quiz Extensions for <b>' +
            cleanValue.split(' ').length +
            '</b> Students')
}
