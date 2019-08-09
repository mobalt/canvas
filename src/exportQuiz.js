import r from './common'
import { today } from './helpers'
import cQ from 'question-converter'
import * as yaml from 'js-yaml'
import download from './download'

// example `7789_quiz88_02-31-2000.yml`
const filename = `${course_id}_quiz${item_id}_${today()}.yml`

r.get(`courses/${course_id}/quizzes/${item_id}/questions`).then(response => {
    const questions = response.data.map(cQ)
    const text = yaml.safeDump(questions)

    download(filename, text)
})
