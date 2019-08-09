import r from './common'
import { today } from './helpers'
import { downloadCsv } from './download'

// example `7789_students_01-31-2000.csv`
const filename = `${course_id}_students_${today()}.csv`
alert(
    `Downloading student list to ${filename}.
     Depending on class-size, might take several seconds.`,
)

// Students have enrollment_role_id == 3, filter out anyone else
r.get(`courses/${course_id}/users?per_page=100&enrollment_role_id=3`).then(
    response => {
        // console.log('Final response', response)

        // first row is header names
        const csvResults = [['canvas_id', 'sis_id', 'name']].concat(
            response.data.map(
                ({ id, sis_user_id: sis, sortable_name: name }) => [
                    id,
                    sis,
                    name,
                ],
            ),
        )

        downloadCsv(filename, csvResults)
    },
)
