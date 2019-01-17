class Answer {
    constructor (text = '') {
        this.answer_text = text
        this.answer_exact = null
        this.answer_error_margin = null
        this.answer_range_start = null
        this.answer_range_end = null
        this.answer_approximate = null
        this.answer_precision = 10
        this.answer_weight = 0
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
    
    correctAnswer () {
        this.answer_weight = 100
    }
}

class Question {
    constructor (type, text, name = 'QUESTION', points = 1) {
        this.question_name = name
        this.question_text = text
        this.points_possible = points
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
    
    addAnswer (text = '') {
        if (!this.answers)
            this.answers = []
        const newAnswer = new Answer(text)
        this.answers.push(newAnswer)
        return newAnswer
    }
}

class Essay extends Question {
    constructor (text, name, points) {
        super('essay_question', text, name, points)
    }
}

class MultipleChoice extends Question {
    constructor (text, name, points) {
        super('multiple_choice_question', text, name, points)
    }
}

class MultipleAnswer extends Question {
    constructor (text, name, points) {
        super('multiple_answers_question', text, name, points)
    }
}

class FillInBlank extends Question {
    constructor (text, name, points) {
        super('short_answer_question', text, name, points)
    }
}

