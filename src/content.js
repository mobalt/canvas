function loadFiles(...files) {
    console.log(arguments)
}

const handlers = {
    Student_List(url, tab) {
        require('./exportStudents')
    },
    Import_Quiz(url, tab) {},
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
        loadFiles(
            'assets/axios.v0.19.0.min.js',
            'assets/jquery.js',
            'common.js',
            'quizAssign.js',
        )
    },
}
handlers[exec_fn]()
