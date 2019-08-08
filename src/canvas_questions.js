const cQ = (function() {
    const lookup = {
        Essay: 'essay_question',
        FileUpload: 'file_upload_question',
        MultipleAnswers: 'multiple_answers_question',
        FillInMultipleBlanks: 'fill_in_multiple_blanks_question',
        MultipleChoice: 'multiple_choice_question',
        MultipleDropdowns: 'multiple_dropdowns_question',
        ShortAnswer: 'short_answer_question',
        Text: 'text_only_question',
        TrueFalse: 'true_false_question',
    }
    const rLookup = {
        multiple_choice_question: [undefined, 'Multiple Choice', 'MC'],
        essay_question: ['Essay'],
        file_upload_question: ['File Upload'],
        fill_in_multiple_blanks_question: ['Fill-in-Multiple Blanks'],
        multiple_answers_question: ['Multiple Answers'],
        multiple_dropdowns_question: ['Multiple Dropdowns'],
        short_answer_question: ['Short Answer'],
        text_only_question: ['Text'],
        true_false_question: ['True False'],
    }

    function isDefined(value) {
        return typeof value != 'undefined' && value != null
    }

    function containsHTML(str) {
        return /<([^>]+)>/.test(str)
    }

    function textHtml(textName, htmlName, required = false) {
        if (!htmlName) htmlName = textName + '_html'

        return Q(
            obj => {
                const { [htmlName]: html, [textName]: text } = obj

                return (
                    (html && html.trim()) ||
                    (text && text.trim()) ||
                    (required ? '' : undefined)
                )
            },
            value => {
                const valueText = String(value).trim()
                const result = {}

                if (isDefined(value) && valueText != '') {
                    if (containsHTML(valueText)) {
                        result[htmlName] = valueText
                    } else {
                        result[textName] = valueText
                    }
                } else if (required) {
                    result[textName] = ''
                }

                return result
            },
        )
    }

    function lookupCanvasType(fuzzyName) {
        if (!fuzzyName) {
            return lookup.MultipleChoice
        }

        let minDistance = Number.MAX_SAFE_INTEGER,
            closestType = 'multiple_choice_question'

        for (let typename in rLookup) {
            for (let possibleMatch of rLookup[typename]) {
                const distance = editDistance(fuzzyName, String(possibleMatch))
                if (distance < minDistance) {
                    minDistance = distance
                    closestType = typename
                }
            }
        }

        return closestType
    }

    const canvasQuestion = Q({
        id: 'id',
        name: 'question_name',
        points: Q(
            'points_possible',
            pp => (pp === 1 ? undefined : pp),
            points => (isDefined(points) ? points : 1),
        ).update({
            checkX: false,
        }),
        text: 'question_text',
        type: Q(
            'question_type',
            qtype => rLookup[qtype] && rLookup[qtype][0],
            type => (type ? lookupCanvasType(type) : lookup.MultipleChoice),
        ).update({
            checkX: false,
        }),
        correct_comments: textHtml('correct_comments'),
        incorrect_comments: textHtml('incorrect_comments'),
        neutral_comments: textHtml('neutral_comments'),
        answer: Q(
            'answers',
            function(answers) {
                if (this.obj.question_type === lookup.TrueFalse) {
                    return !!answers[0].weight
                }
                return undefined
            },
            isTrue => [
                { text: 'True', weight: isTrue ? 100 : 0 },
                { text: 'False', weight: isTrue ? 0 : 100 },
            ],
        ),
        answers: Q.mapTo(
            'answers',
            Q({
                id: 'id',
                group: 'blank_id',
                comments: textHtml('comments'),
                text: textHtml('text', 'html', true),
                isCorrect: Q(
                    'weight',
                    weight => !!weight,
                    isCorrect => (isCorrect ? 100 : 0),
                ),
            }),
        ),
    })

    return canvasQuestion
})()
