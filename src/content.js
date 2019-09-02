function loadFiles(...files) {
    console.log(arguments)
}

const handlers = {
    Student_List(url, tab) {
        require('./exportStudents')
    },
    Import_Quiz(url, tab) {},
    Export_Responses(url, tab) {
        require('./download_submissions')
    },
    Export_Quiz(url, tab) {
        require('./exportQuiz')
    },
    Add_Questions(url, tab) {
        loadFiles(
            'assets/jquery.js',
            'assets/js-yaml.js',
            'quizzes.js',
            'quizPost.js',
        )
    },
    Moderate_Quiz(url, tab) {
        require('./moderate_quiz')
    },
    Quiz_Overrides(url, tab) {
        require('./quizAssign')
    },
}
handlers[exec_fn]()
