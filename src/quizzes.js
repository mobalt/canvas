class Group {
    constructor(name, points, pick) {
        this.name = name || 'group'
        this.question_points = points || 1
        this.pick_count = pick
        this.assessment_question_bank_id = null
        this.questions = []
        this.group_id = 5
    }

    addQuestion(question) {
        this.questions.push(question)
    }

    toJSON() {
        this.questions.forEach(q => {
            q.quiz_group_id = this.group_id
        })
        return this.questions
    }
}

class Answer {
    constructor(text = '') {
        this.answer_text = text
        this.answer_weight = 0
        this.answer_error_margin = null
        this.answer_exact = null
        this.answer_range_start = null
        this.answer_range_end = null
        this.answer_approximate = null
        this.answer_precision = 10
        this.numerical_answer_type = 'exact_answer'
        this.blank_id = null
        this.id = null
        this.match_id = null
        this.answer_match_left = null
        this.answer_match_right = null
        this.answer_comment = null
        this.answer_html = null
        this.answer_match_left_html = null
        this.answer_comment_html = null
    }

    correctAnswer() {
        this.answer_weight = 100
    }
}

class Question {
    constructor(type, text, name = 'QUESTION', points = 1) {
        this.question_name = name
        this.question_text = text
        this.points_possible = +points
        this.question_type = type
        this.assessment_question_id = null
        this.correct_comments_html = null
        this.incorrect_comments_html = null
        this.neutral_comments_html = null
        this.regrade_option = null
        this.position = 0
        this.text_after_answers = null
        this.matching_answer_incorrect_matches = null
    }

    addAnswer(text = '', isCorrect = false) {
        if (!this.answers) this.answers = []
        const newAnswer = new Answer(text)
        if (isCorrect) newAnswer.correctAnswer()
        this.answers.push(newAnswer)
        return newAnswer
    }
}

class TextOnly extends Question {
    constructor(text) {
        super('text_only_question', text, 'TextOnly', 0)
    }
}

class Essay extends Question {
    constructor(text, name, points) {
        super('essay_question', text, name, points)
    }
}

class FileUpload extends Question {
    constructor(text, name, points) {
        super('file_upload_question', text, name, points)
    }
}

function parseAnswer(text) {
    const parts = /^ *([<])? *(.+?) *$/.exec(text)
    const answerText = parts[2]
    const isCorrect = !!parts[1]

    return [answerText, isCorrect]
}

class MultipleChoice extends Question {
    constructor(text, name, points, answers) {
        super('multiple_choice_question', text, name, points)
        answers.map(parseAnswer).map(([answerText, isCorrect]) => {
            const ans = this.addAnswer(answerText)
            if (isCorrect) ans.correctAnswer()
        })
    }
}

class MultipleAnswer extends Question {
    constructor(text, name, points, answers) {
        super('multiple_answers_question', text, name, points)
        answers.map(parseAnswer).map(([answerText, isCorrect]) => {
            const ans = this.addAnswer(answerText)
            if (isCorrect) ans.correctAnswer()
        })
    }
}

class FillInBlank extends Question {
    constructor(text, name, points, answers) {
        super('short_answer_question', text, name, points)
        answers.forEach(answerText => this.addAnswer(answerText))
    }

    addAnswer(text = '') {
        return super.addAnswer(text).correctAnswer()
    }
}

class MultipleBlanks extends Question {
    constructor(text, name, points, answers) {
        super('fill_in_multiple_blanks_question', text, name, points)
        Object.entries(answers).forEach(([blank_id, subAnswers]) => {
            subAnswers.forEach(answerText => {
                this.addAnswer(answerText, blank_id)
            })
        })
    }

    addAnswer(text = '', blank_id) {
        let answer = super.addAnswer(text)
        answer.blank_id = blank_id
        answer.correctAnswer()
        return answer
    }
}

class MultipleDropDowns extends Question {
    constructor(text, name, points, answers) {
        super('multiple_dropdowns_question', text, name, points)

        Object.entries(answers).forEach(([blank_id, subAnswers]) => {
            subAnswers.map(parseAnswer).forEach(([answerText, isCorrect]) => {
                const answer = this.addAnswer(answerText, blank_id)
                if (isCorrect) answer.correctAnswer()
            })
        })
    }

    addAnswer(text = '', blank_id) {
        let answer = super.addAnswer(text)
        answer.blank_id = blank_id
        return answer
    }
}

class TrueFalse extends Question {
    constructor(text, name, points, isTrue) {
        super('true_false_question', text, name, points)
        const t = this.addAnswer('True')
        const f = this.addAnswer('False')
        if (isTrue) t.correctAnswer()
        else f.correctAnswer()
    }
}

class Matching extends Question {
    //todo: implement this
}
